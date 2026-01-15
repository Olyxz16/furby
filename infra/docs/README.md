# Setup

## Secrets

### SOPS

Il faut donner la clé age au cluster pour qu'il puisse déchiffrer les fichiers secrets.yaml.

```bash
cat ~/.config/sops/age/keys.txt | kubectl create secret generic sops-age --namespace=flux-system --from-file=age.agekey=/dev/stdin
```

### Docker auth

Le token Github pour pouvoir accès au repo ghcr privé.
Token classic (legacy),
Permissions :
- Packages: read-only

```bash
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=TON_USER_GITHUB \
  --docker-password=TON_TOKEN_FINE_GRAINED \
  --docker-email=ton@email.com \
  -n default
```

### Flux

Token pour le setup de flux, pas besoin de le garder ensuite dans le cluster
Token fine grained,
Permissions : 
- Administration: read+write
- Contents: read+write
- Metadata: read
