from PIL import Image, ImageOps, ImageDraw

def make_circle(image_path, output_path):
    img = Image.open(image_path).convert("RGBA")
    
    # Create valid circular mask
    mask = Image.new('L', img.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0) + img.size, fill=255)
    
    # Apply mask
    output = ImageOps.fit(img, mask.size, centering=(0.5, 0.5))
    output.putalpha(mask)
    
    output.save(output_path)
    print(f"Circular image saved to {output_path}")

try:
    make_circle("/Users/vedansh/Desktop/rishi/IMG_1168.PNG", "/Users/vedansh/Desktop/rishi/public/circular-logo.png")
except Exception as e:
    print(f"Error: {e}")
