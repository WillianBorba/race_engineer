from fastapi import FastAPI

app = FastAPI(title="ACC Telemetry Service", version="0.1.0")


@app.get("/health")
def health():
    return {"status": "ok", "service": "acc-telemetry"}


@app.get("/")
def root():
    return {"message": "ACC Telemetry Service is running"}
