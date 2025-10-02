import cv2
from pyxelate import Pyx

# Path to the image you want to test
img_path = "img/vaynerender.png"   # <-- change to your file name
output_path = "img/vaynerender.png"

# Pixelation settings
factor = 4    # smaller = finer pixels, bigger = blockier
palette = 32  # number of colors

# Load the image
img = cv2.imread(img_path)

# Initialize Pyxelate
pyx = Pyx(factor=factor, palette=palette)
pyx.fit(img)

# Transform (pixelate)
pixelated = pyx.transform(img)

# Save result
cv2.imwrite(output_path, pixelated)
print(f"✅ Pixelated image saved to {output_path}")
