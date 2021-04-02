[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$v=(git describe --tags); 

write-output "{""version"": ""$v""}" | out-file "public\\version.json" -encoding utf8
