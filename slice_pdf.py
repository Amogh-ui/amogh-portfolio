import fitz
import sys
import os

def slice_pdf(pdf_path, output_dir, slice_height_pt=4000):
    os.makedirs(output_dir, exist_ok=True)
    # clean output dir
    for f in os.listdir(output_dir):
        if f.endswith('.jpg'):
            os.remove(os.path.join(output_dir, f))
    
    doc = fitz.open(pdf_path)
    page = doc[0]
    rect = page.rect
    w, h = rect.width, rect.height
    
    print(f"Processing {pdf_path}, dimensions: {w}x{h}")
    
    slice_idx = 1
    y0 = 0
    while y0 < h:
        y1 = min(y0 + slice_height_pt, h)
        clip = fitz.Rect(0, y0, w, y1)
        matrix = fitz.Matrix(1.5, 1.5) # 1.5x scale for better quality since original is just PDF vector/images
        pix = page.get_pixmap(matrix=matrix, clip=clip)
        out_path = os.path.join(output_dir, f"{slice_idx}.jpg")
        pix.save(out_path, output="jpg", jpg_quality=85)
        slice_idx += 1
        y0 = y1
    
    print(f"Generated {slice_idx - 1} images in {output_dir}")

slice_pdf("/Users/amoghshete/Documents/PORTFOLIO WEBSITE/Beyond the net/Frame 5.pdf", "/Users/amoghshete/Documents/PORTFOLIO WEBSITE/public/beyond-the-net-scroll")
slice_pdf("/Users/amoghshete/Documents/PORTFOLIO WEBSITE/Ticketsure/Ticketsure documentation.pdf", "/Users/amoghshete/Documents/PORTFOLIO WEBSITE/public/ticketsure-scroll")
