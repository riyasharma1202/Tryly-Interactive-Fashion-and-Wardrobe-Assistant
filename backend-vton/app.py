from fastapi import FastAPI, File, UploadFile
from fastapi.responses import Response
import io
import time
import os
import tempfile
from PIL import Image

try:
    from gradio_client import Client, handle_file
    GRADIO_AVAILABLE = True
except ImportError:
    GRADIO_AVAILABLE = False
    print("WARNING: gradio_client not found. Run: pip install gradio_client")

app = FastAPI(title="Tryly API", description="VTON AI Service using Cloud APIs")

# We will connect to a free public Hugging Face space running an open-source VTON model
# Example: Using a public OOTDiffusion or similar VTON space
try:
    if GRADIO_AVAILABLE:
        print("Connecting to Free Public AI Server (Hugging Face)...")
        # using a reliable public space for Try On (e.g. KwaiVGI/LivePortrait or similar VTON)
        # We will use the popular "yisol/IDM-VTON" which is the #1 open source VTON on HF
        client = Client("yisol/IDM-VTON")
        print("✅ Connected to Cloud AI!")
except Exception as e:
    print("Error connecting to Hugging Face:", e)
    client = None

@app.post("/generate-vton")
async def generate_vton(user_image: UploadFile = File(...), garment_image: UploadFile = File(...)):
    user_bytes = await user_image.read()
    garment_bytes = await garment_image.read()
    
    print(f"[{time.strftime('%X')}] Request received. Sending to Cloud AI...")
    
    if GRADIO_AVAILABLE and client is not None:
        try:
            # 1. Save uploaded files temporarily so Gradio Client can read them
            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_user:
                tmp_user.write(user_bytes)
                user_path = tmp_user.name
                
            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_garment:
                tmp_garment.write(garment_bytes)
                garment_path = tmp_garment.name
                
            # 2. Call the public Gradio API
            # Note: API endpoints differ per space. This assumes a standard image-in image-out VTON space.
            # Example gradio signature: predict(dict, dict, string, bool, bool, int, int)
            # You might need to adjust the api_name and arguments based on the exact HF Space you connect to.
            print("Processing in the cloud (Takes ~15-30 seconds depending on public server load)...")
            
            result = client.predict(
                dict({"background":handle_file(user_path),"layers":[],"composite":None}),
                handle_file(garment_path),
                "Hello!!",
                True,
                True,
                30,
                42,
                api_name="/tryon"
            )
            
            # The result is typically a filepath to the generated image
            result_image_path = result[0]
            
            # 3. Read the resulting image
            with open(result_image_path, "rb") as f:
                result_bytes = f.read()
                
            print("✅ Cloud AI Generation Complete.")
            
            # Cleanup temp files
            os.remove(user_path)
            os.remove(garment_path)
            
            return Response(content=result_bytes, media_type="image/jpeg")
            
        except Exception as e:
            print("⚠️ Cloud API Error:", e)
            print("Falling back to original image.")
            return Response(content=user_bytes, media_type="image/jpeg")
    else:
        print("⚠️ Gradio Client not loaded! Returning original image as fallback.")
        return Response(content=user_bytes, media_type="image/jpeg")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
