# Self-hosting LiveKit on a DigitalOcean Droplet

1. Create a Droplet: Ubuntu 24.04, at least 2 vCPU / 4 GB RAM. Choose the **Bangalore** region for Indian viewers.
2. Domain: add an A record pointing at the Droplet IP (or use `<ip-with-dashes>.nip.io`).
3. Copy this folder to the Droplet and run:
   ```bash
   scp -r deploy/livekit root@YOUR_DROPLET_IP:~/livekit
   ssh root@YOUR_DROPLET_IP
   cd livekit && bash setup.sh your-domain.example.com
   ```
4. Copy the three printed values into Vercel (`LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`) and redeploy.

The app code does not change. It talks to whatever `LIVEKIT_URL` points at.

Also open the ports in the DigitalOcean **Cloud Firewall** if you use one: 22, 80, 443 (TCP), 7881 (TCP), 50000-51000 (UDP).
