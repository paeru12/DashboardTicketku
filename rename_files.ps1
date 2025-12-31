# Rename semua .tsx ke .jsx
Get-ChildItem -Path "d:\StudiKasus\Ticket\Ticket\src" -Recurse -Filter "*.tsx" | ForEach-Object {
    $newName = $_.FullName -replace "\.tsx$", ".jsx"
    Rename-Item -Path $_.FullName -NewName $newName
    Write-Host "Renamed: $($_.Name) -> $(Split-Path $newName -Leaf)"
}

# Rename semua .ts ke .js (kecuali .d.ts)
Get-ChildItem -Path "d:\StudiKasus\Ticket\Ticket\src" -Recurse -Filter "*.ts" | Where-Object { $_.Name -notlike "*.d.ts" } | ForEach-Object {
    $newName = $_.FullName -replace "\.ts$", ".js"
    Rename-Item -Path $_.FullName -NewName $newName
    Write-Host "Renamed: $($_.Name) -> $(Split-Path $newName -Leaf)"
}

Write-Host "File renaming completed!"
