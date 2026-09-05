import fitz
import os
from PIL import Image
import io

pdf_path = "/Users/amoghshete/Documents/PORTFOLIO WEBSITE/Beyond the net/Frame 5.pdf"
output_dir = "/Users/amoghshete/Documents/PORTFOLIO WEBSITE/public/beyond-the-net-scroll/"

# Ensure output directory exists and is empty
os.makedirs(output_dir, exist_ok=True)
os.system(f"rm -f '{output_dir}'*.jpg")

doc = fitz.open(pdf_path)
page = doc[0]

# Render the whole page at high resolution
# We want the output width to be around 2400px.
# PDF width is 1980, so zoom = 2400 / 1980 = 1.212
zoom = 2400 / 1980
mat = fitz.Matrix(zoom, zoom)

pix = page.get_pixmap(matrix=mat)
img = Image.open(io.BytesIO(pix.tobytes("png")))

width, height = img.size
# Target slice height
slice_height = 4823

num_slices = (height + slice_height - 1) // slice_height
print(f"Total height: {height}px, width: {width}px")
print(f"Generating {num_slices} slices of max height {slice_height}px...")

for i in range(num_slices):
    top = i * slice_height
    bottom = min(top + slice_height, height)
    slice_img = img.crop((0, top, width, bottom))
    
    # Save as high-quality JPG
    out_path = os.path.join(output_dir, f"{i + 1}.jpg")
    slice_img.convert("RGB").save(out_path, "JPEG", quality=90)
    print(f"Saved {out_path} (size: {slice_img.size})")

print(f"Successfully generated {num_slices} images.")
