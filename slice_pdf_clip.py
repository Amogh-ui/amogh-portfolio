import fitz
import os
from PIL import Image
import io

pdf_path = "/Users/amoghshete/Documents/PORTFOLIO WEBSITE/Beyond the net/Frame 5.pdf"
output_dir = "/Users/amoghshete/Documents/PORTFOLIO WEBSITE/public/beyond-the-net-scroll/"

os.makedirs(output_dir, exist_ok=True)
os.system(f"rm -f '{output_dir}'*.jpg")

doc = fitz.open(pdf_path)
page = doc[0]

# PDF dimensions
pdf_width = page.rect.width
pdf_height = page.rect.height

# We want 11 slices as that divides 43770 almost perfectly
num_slices = 11
slice_pdf_height = pdf_height / num_slices

# Zoom to output 2400px width
zoom = 2400 / pdf_width
mat = fitz.Matrix(zoom, zoom)

for i in range(num_slices):
    top = i * slice_pdf_height
    bottom = min((i + 1) * slice_pdf_height, pdf_height)
    
    # Create clipping rect
    clip = fitz.Rect(0, top, pdf_width, bottom)
    
    # Render just this slice
    pix = page.get_pixmap(matrix=mat, clip=clip)
    
    img = Image.open(io.BytesIO(pix.tobytes("png")))
    out_path = os.path.join(output_dir, f"{i + 1}.jpg")
    img.convert("RGB").save(out_path, "JPEG", quality=90)
    print(f"Saved {out_path} (size: {img.size})")

print("Done!")
