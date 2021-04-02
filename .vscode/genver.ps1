$v=(git describe --tags); 
echo "{""version"": ""$v""}" > build\\version.json