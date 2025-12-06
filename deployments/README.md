## Deployments quickstart

- Values files live under `deployments/values-<env>.yaml`. Copy `deployments/values.template.yaml` to start a new environment and fill every placeholder (projectId, region, service account email, VPC connector, secrets, resources). No defaults are assumed.
- Helm chart is at `deployments/chart/` and renders a `run.googleapis.com/v1` Cloud Run Service manifest. The GitHub Actions workflow injects the final image repo/tag and uses `gcloud run services replace` to apply it.
- Secrets are referenced directly from Secret Manager using `secret.name` and `secret.version` (optionally `projectId`). Add more entries under `service.env` as needed.
- VPC settings (`service.vpcAccess.connector` and `egress`) plus DB host/password secrets should be set per environment; Cloud Run remains publicly reachable while the DB stays private through the connector.

## GitHub Actions

- Reusable workflow: `.github/workflows/reusable-cloud-run.yaml`
  - Inputs (all required unless noted): `env_name`, `project_id`, `region`, `service_name`, `artifact_repo`, `image_name`, `values_file`, `allow_unauthenticated`, `run_tests`, `workload_identity_provider`, `service_account_email`, `audience` (optional).
  - Behavior: optional tests (`npm install` then `npm run test:cov`), build/push image with tags `latest` and `${GITHUB_SHA}` via Docker Buildx to `${region}-docker.pkg.dev/${project_id}/${artifact_repo}/${image_name}`, render Helm manifest, deploy with `gcloud run services replace`, optionally grant unauthenticated access.
- Entry workflow: `.github/workflows/deploy.yaml`
  - Push to `main` deploys `dev` using `deployments/values-dev.yaml`.
  - `workflow_dispatch` accepts explicit inputs for any environment.
- Set `allow_unauthenticated` in the workflow inputs per environment to control public access (the values files include the field for reference only).

## Required GitHub secrets (example naming)

- `DEV_GCP_PROJECT_ID` = `only-callers-dev`
- `DEV_GCP_WORKLOAD_ID_PROVIDER` = full Workload Identity Provider resource path
- `DEV_GCP_SERVICE_ACCOUNT_EMAIL` = deployer service account email
- `DEV_GCP_AUDIENCE` = audience string if your provider expects one (optional)
- Repeat per environment with your preferred prefixes.

## Image tagging

- Each deploy pushes two tags: `${GITHUB_SHA}` and `latest`. Override repository/image names via workflow inputs if you need different tagging or repos.
