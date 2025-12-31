# Script untuk konversi TypeScript ke JavaScript
$srcPath = "d:\StudiKasus\Ticket\Ticket\src"

# Get all .ts and .tsx files
$files = Get-ChildItem -Path $srcPath -Recurse -Include "*.ts", "*.tsx"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Rename vite-env.d.ts file
    if ($file.Name -eq "vite-env.d.ts") {
        $newPath = $file.FullName -replace '\.d\.ts$', '.d.js'
    } else {
        # Replace .ts with .js and .tsx with .jsx
        $newPath = $file.FullName -replace '\.tsx?$', {
            if ($_.Value -eq '.tsx') { '.jsx' } else { '.js' }
        }
    }
    
    # Remove type annotations and interfaces
    $content = $content -replace 'import type \{([^}]+)\}', 'import { $1 }'
    
    # Remove type assertions like "as string", "as number", etc.
    $content = $content -replace ' as [A-Za-z<>,\s\[\]]*(?=[,;)])', ''
    
    # Remove interface/type declarations (keep just the comment)
    $content = $content -replace 'interface\s+\w+[^{]*\{[^}]*\}', ''
    $content = $content -replace 'type\s+\w+\s*=\s*[^;]+;', ''
    
    # Remove React.FC and React.ReactNode type hints
    $content = $content -replace '\sas React\.[A-Za-z]+', ''
    $content = $content -replace ': React\.[A-Za-z<>]+', ''
    
    # Remove function parameter types
    $content = $content -replace ':\s*[A-Za-z<>,\[\]\s|&]*(?=[,\)])', ''
    
    # Remove generic type parameters from function declarations
    $content = $content -replace 'function\s+(\w+)<[^>]+>', 'function $1'
    
    # Save the converted content
    Set-Content -Path $newPath -Value $content -Encoding UTF8
    
    # Delete old file if name changed
    if ($newPath -ne $file.FullName) {
        Remove-Item $file.FullName -Force
        Write-Host "Converted: $($file.Name) -> $(Split-Path $newPath -Leaf)"
    }
}

Write-Host "Conversion completed!"
