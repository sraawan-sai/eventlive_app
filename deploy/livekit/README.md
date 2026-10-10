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

## Oracle Cloud notes

- Create the instance (Ubuntu 22.04/24.04; Ampere ARM or AMD both work, 2+ OCPU/vCPU and 4+ GB RAM recommended). Pick the **Mumbai** or **Hyderabad** region.
- **Open the ports in the Oracle console too** (this is separate from the server firewall):
  Networking, Virtual Cloud Networks, your VCN, Security Lists, Add Ingress Rules (source `0.0.0.0/0`):
  TCP 80, TCP 443, TCP 7881, UDP 50000-51000.
- SSH user is `ubuntu`, not root. Run the script with sudo: `sudo bash setup.sh your-domain`.
- Check the free-tier limits on Oracle's page for outbound data per month before relying on it for large events.
