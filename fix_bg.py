import codecs

f = r'c:/Users/landa/OneDrive/Desktop/dự án mua hàng/purchase-management/src/features/auth/ui/LoginPage.tsx'
with codecs.open(f, 'r', 'utf-8') as file:
    content = file.read()

# Remove background image URL and related properties
content = content.replace("backgroundImage: 'url(https://minimax-algeng-chat-tts-us.oss-us-east-1.aliyuncs.com/ccv2%2F2026-06-26%2FMiniMax-M2.7%2F2045431618054664525%2Fccce7e24238f8420b7c53ded21d1b29cd8088a5ddc17063f79b43abb132ca6e7..png?Expires=1782550042&OSSAccessKeyId=LTAI5tCpJNKCf5EkQHSuL9xg&Signature=bwFsVKgfl0Rt0Y%2B7IzQUbSNxz%2F4%3D)',", "")
content = content.replace("backgroundSize: 'cover',", "")
content = content.replace("backgroundPosition: 'center',", "")
content = content.replace("backgroundRepeat: 'no-repeat',", "")

with codecs.open(f, 'w', 'utf-8') as file:
    file.write(content)

print("Done")