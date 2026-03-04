const XLSX = require('xlsx');
const fs = require('fs');

function parseExcel(filePath) {
    try {
        console.log('正在读取Excel文件...');
        
        // 读取Excel文件
        const workbook = XLSX.readFile(filePath, { cellDates: true });
        
        const result = {
            工作表列表: workbook.SheetNames,
            数据: {}
        };
        
        // 遍历所有工作表
        workbook.SheetNames.forEach(sheetName => {
            console.log(`\n${'='.repeat(50)}`);
            console.log(`工作表: ${sheetName}`);
            console.log('='.repeat(50));
            
            const sheet = workbook.Sheets[sheetName];
            
            // 转换为JSON格式
            const jsonData = XLSX.utils.sheet_to_json(sheet, { 
                header: 1,
                defval: null,
                raw: false
            });
            
            // 打印数据
            jsonData.forEach((row, idx) => {
                if (row.some(cell => cell !== null && cell !== '')) {
                    console.log(`第${idx + 1}行:`, row);
                }
            });
            
            result.数据[sheetName] = jsonData;
        });
        
        // 保存为JSON文件
        fs.writeFileSync(
            '需求解析结果.json', 
            JSON.stringify(result, null, 2),
            'utf-8'
        );
        
        console.log(`\n${'='.repeat(50)}`);
        console.log("解析完成！结果已保存到 '需求解析结果.json'");
        console.log('='.repeat(50));
        
        return result;
        
    } catch (error) {
        console.error('解析出错:', error.message);
        return null;
    }
}

// 执行解析
parseExcel('需求.xlsx');
