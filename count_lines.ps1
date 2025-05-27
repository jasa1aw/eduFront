# Подсчет строк кода без пробелов и комментариев
$totalLines = 0
$fileCount = 0

# Функция для проверки, является ли строка комментарием
function Is-CommentLine {
    param($line)
    $trimmed = $line.Trim()
    return $trimmed.StartsWith("//") -or 
           $trimmed.StartsWith("/*") -or 
           $trimmed.StartsWith("*") -or 
           $trimmed.EndsWith("*/") -or
           $trimmed.StartsWith("<!--") -or
           $trimmed.EndsWith("-->")
}

# Получаем все TypeScript, JavaScript и другие файлы кода
Get-ChildItem -Path "src" -Recurse -Include "*.ts", "*.tsx", "*.js", "*.jsx" | ForEach-Object {
    $content = Get-Content $_.FullName -ErrorAction SilentlyContinue
    if ($content) {
        $codeLines = 0
        $inBlockComment = $false
        
        foreach ($line in $content) {
            $trimmed = $line.Trim()
            
            # Пропускаем пустые строки
            if ($trimmed -eq "") { continue }
            
            # Обрабатываем блочные комментарии
            if ($trimmed -match "/\*") { $inBlockComment = $true }
            if ($inBlockComment) {
                if ($trimmed -match "\*/") { $inBlockComment = $false }
                continue
            }
            
            # Пропускаем однострочные комментарии
            if (Is-CommentLine $line) { continue }
            
            $codeLines++
        }
        
        Write-Host "$($_.Name): $codeLines строк кода"
        $totalLines += $codeLines
        $fileCount++
    }
}

Write-Host ""
Write-Host "===== ИТОГО ====="
Write-Host "Всего файлов: $fileCount"
Write-Host "Общее количество строк кода: $totalLines" 