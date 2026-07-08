 tôimport os
import requests
from PIL import Image
from io import BytesIO

# Original URL
url = "https://minimax-algeng-chat-tts-us.oss-us-east-1.aliyuncs.com/ccv2%2F2026-07-01%2FMiniMax-M2.7%2F2045431618054664525%2Fccce7e24238f8420b7c53ded21d1b29cd8088a5ddc17063f79b43abb132ca6e7..png?Expires=1782965892&OSSAccessKeyId=LTAI5tCpJNKCf5EkQHSuL9xg&Signature=2NfeM7nQeAr83wOWh%2BDTNAdP8zQ%3D"

# Target path
target_dir = r"c:\Users\landa\OneDrive\Desktop\dự án mua hàng\purchase-management\public"
os.makedirs(target_dir, exist_ok=True)
target_path = os.path.join(target_dir, "login-bg.webp")

print(f"Downloading image from {url}...")
response = requests.get(url)
if response.status_code == 200:
    img = Image.open(BytesIO(response.content))
    
    # Original size
    orig_w, orig_h = img.size
    print(f"Original size: {orig_w}x{orig_h}")
    
    # Scale down to reasonable width for web load optimization (e.g. 1600px width max)
    target_width = 1600
    if orig_w > target_width:
        ratio = target_width / float(orig_w)
        target_height = int(float(orig_h) * float(ratio))
        img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
        print(f"Resized to: {target_width}x{target_height}")
        
    # Save as WebP with 75% quality (excellent compression-to-quality ratio)
    img.save(target_path, "WEBP", quality=75, optimize=True)
    
    file_size_kb = os.path.getsize(target_path) / 1024.0
    print(f"Saved optimized image to {target_path}")
    print(f"Optimized File Size: {file_size_kb:.2f} KB")
else:
    print(f"Failed to download image: {response.status_code}")
