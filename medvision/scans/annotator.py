import cv2
import os 
import uuid 
from django.conf import settings

def draw_fracture_highlight(image_path, bbox, condition, confidence, severity):
    img = cv2.imread(image_path)
    if img is None:
        return None

    height, width = img.shape[:2]

    colors = {
        'high':   (0, 0, 255),
        'medium': (0, 165, 255),
        'low':    (0, 255, 255),
        'normal': (0, 200, 0),
    }
    color = colors.get(severity, (0, 255, 0))

    x_min = int(bbox.get('x_min', 0))
    y_min = int(bbox.get('y_min', 0))
    x_max = int(bbox.get('x_max', 0))
    y_max = int(bbox.get('y_max', 0))

    if x_max > x_min and y_max > y_min:
        # Draw fracture box (existing code)
        overlay = img.copy()
        cv2.rectangle(overlay, (x_min, y_min), (x_max, y_max), color, -1)
        cv2.addWeighted(overlay, 0.25, img, 0.75, 0, img)
        cv2.rectangle(img, (x_min, y_min), (x_max, y_max), color, 3)

        # Corner accents
        c = 20
        t = 4
        cv2.line(img, (x_min, y_min), (x_min+c, y_min), color, t)
        cv2.line(img, (x_min, y_min), (x_min, y_min+c), color, t)
        cv2.line(img, (x_max, y_min), (x_max-c, y_min), color, t)
        cv2.line(img, (x_max, y_min), (x_max, y_min+c), color, t)
        cv2.line(img, (x_min, y_max), (x_min+c, y_max), color, t)
        cv2.line(img, (x_min, y_max), (x_min, y_max-c), color, t)
        cv2.line(img, (x_max, y_max), (x_max-c, y_max), color, t)
        cv2.line(img, (x_max, y_max), (x_max, y_max-c), color, t)

        # Label
        label = f"{condition} ({confidence}%)"
        font = cv2.FONT_HERSHEY_SIMPLEX
        (tw, th), _ = cv2.getTextSize(label, font, 0.7, 2)
        cv2.rectangle(img, (x_min, y_min-th-12), (x_min+tw+10, y_min), color, -1)
        cv2.putText(img, label, (x_min+5, y_min-8), font, 0.7, (255,255,255), 2)

        # Arrow
        mid_y = y_min + (y_max - y_min) // 2
        cv2.arrowedLine(img, (x_max+40, mid_y), (x_max+2, mid_y), color, 2, tipLength=0.3)
        cv2.putText(img, "FRACTURE", (x_max+45, mid_y+5), font, 0.55, color, 2)

    else:
        # ✅ NEW — No fracture detected case
        # Draw green border around entire image
        cv2.rectangle(img, (10, 10), (width-10, height-10), (0, 200, 0), 4)

        # Green checkmark banner at top
        cv2.rectangle(img, (0, 0), (width, 60), (0, 200, 0), -1)
        cv2.putText(
            img,
            f"NO FRACTURE DETECTED  ({confidence}% confidence)",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX, 0.8,
            (255, 255, 255), 2
        )

        # Condition text at bottom
        cv2.rectangle(img, (0, height-50), (width, height), (0,0,0), -1)
        cv2.putText(
            img,
            f"Condition: {condition[:50]}",
            (10, height-20),
            cv2.FONT_HERSHEY_SIMPLEX, 0.55,
            (200, 200, 200), 1
        )

    # Watermark
    cv2.putText(
        img,
        f"MedVision AI | {severity.upper()} | Confidence: {confidence}%",
        (10, height - 15 if x_max > x_min else height - 60),
        cv2.FONT_HERSHEY_SIMPLEX, 0.45,
        (200, 200, 200), 1
    )

    # Save
    save_dir = os.path.join(settings.MEDIA_ROOT, 'annotated')
    os.makedirs(save_dir, exist_ok=True)
    filename = f"annotated_{uuid.uuid4().hex}.jpg"
    cv2.imwrite(os.path.join(save_dir, filename), img)

    return f"annotated/{filename}"