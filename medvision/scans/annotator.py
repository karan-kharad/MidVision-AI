import cv2
import os 
import uuid 
import numpy as np
from django.conf import settings

def draw_fracture_highlight(image_path, bbox, condition, confidence, severity):
    """
    Professional YOLO-style Annotator for MedVision AI.
    Draws high-fidelity bounding boxes and labels based on Gemini detection data.
    """
    img = cv2.imread(image_path)
    if img is None:
        return None

    height, width = img.shape[:2]

    # YOLO-inspired color palette (Clinical Edition)
    colors = {
        'high':   (0, 23, 255),    # Sharp Red
        'medium': (0, 145, 255),   # Deep Orange
        'low':    (0, 229, 255),   # AI Cyan
        'normal': (83, 200, 0),    # Clinical Green
    }
    color = colors.get(severity.lower(), (0, 229, 255))

    # Scale normalized coordinates (0-1000) to actual pixels
    x_min = int((bbox.get('x_min', 0) * width) / 1000)
    y_min = int((bbox.get('y_min', 0) * height) / 1000)
    x_max = int((bbox.get('x_max', 0) * width) / 1000)
    y_max = int((bbox.get('y_max', 0) * height) / 1000)

    if x_max > x_min and y_max > y_min:
        # 1. Draw Bounding Box (YOLO Style: Thin & Sharp)
        line_thickness = max(2, int(min(width, height) / 400))
        cv2.rectangle(img, (x_min, y_min), (x_max, y_max), color, line_thickness)

        # 2. Draw Label "Badge" (Top-Left of Box)
        label = f"{condition} {confidence}%"
        font_scale = min(width, height) / 1200
        font_thickness = max(1, int(font_scale * 2))
        
        # Get text size for the background rectangle
        (tw, th), baseline = cv2.getTextSize(label, cv2.FONT_HERSHEY_DUPLEX, font_scale, font_thickness)
        
        # Ensure label doesn't go off top of screen
        label_y1 = max(y_min - th - 10, 0)
        label_y2 = y_min
        
        # Draw solid background for label
        cv2.rectangle(img, (x_min, label_y1), (x_min + tw + 10, label_y2), color, -1)
        
        # Draw white text on the colored background
        cv2.putText(img, label, (x_min + 5, label_y2 - 7), 
                    cv2.FONT_HERSHEY_DUPLEX, font_scale, (255, 255, 255), font_thickness, cv2.LINE_AA)

        # 3. Corner Accents (YOLOv8 Modern UI Style)
        accent_len = int((x_max - x_min) * 0.1)
        at = line_thickness + 2
        # Top-Left
        cv2.line(img, (x_min, y_min), (x_min + accent_len, y_min), color, at)
        cv2.line(img, (x_min, y_min), (x_min, y_min + accent_len), color, at)
        # Top-Right
        cv2.line(img, (x_max, y_min), (x_max - accent_len, y_min), color, at)
        cv2.line(img, (x_max, y_min), (x_max, y_min + accent_len), color, at)
        # Bottom-Left
        cv2.line(img, (x_min, y_max), (x_min + accent_len, y_max), color, at)
        cv2.line(img, (x_min, y_max), (x_min, y_max - accent_len), color, at)
        # Bottom-Right
        cv2.line(img, (x_max, y_max), (x_max - accent_len, y_max), color, at)
        cv2.line(img, (x_max, y_max), (x_max, y_max - accent_len), color, at)

    else:
        # Fallback for "Clear" scans (Full border overlay)
        cv2.rectangle(img, (0, 0), (width, height), (83, 200, 0), 10)
        cv2.putText(img, f"SYSTEM STATUS: NO ABNORMALITIES DETECTED ({confidence}%)", (20, 50), 
                    cv2.FONT_HERSHEY_DUPLEX, 1.0, (83, 200, 0), 2, cv2.LINE_AA)

    # Professional Medical Watermark
    overlay = img.copy()
    cv2.rectangle(overlay, (0, height - 40), (width, height), (0,0,0), -1)
    cv2.addWeighted(overlay, 0.4, img, 0.6, 0, img)
    
    cv2.putText(img, f"MEDVISION AI DIAGNOSTIC ENGINE | SCAN ID: {uuid.uuid4().hex[:8].upper()} | SEVERITY: {severity.upper()}", 
                (20, height - 15), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (200, 200, 200), 1, cv2.LINE_AA)

    # Save to media directory
    save_dir = os.path.join(settings.MEDIA_ROOT, 'annotated')
    os.makedirs(save_dir, exist_ok=True)
    filename = f"yolo_annotated_{uuid.uuid4().hex}.jpg"
    cv2.imwrite(os.path.join(save_dir, filename), img, [cv2.IMWRITE_JPEG_QUALITY, 95])

    return f"annotated/{filename}"