param(
    [string]$Message = "chore: update"
)

Write-Host "Deploiement en cours..." -ForegroundColor Cyan

git add -A
git commit -m $Message
git push
npx vercel --prod

Write-Host "Deploiement termine !" -ForegroundColor Green
