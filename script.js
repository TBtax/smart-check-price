document.addEventListener('DOMContentLoaded', function() {
    // Global Configuration 
    const errorPanes = [ 
        { id: 'unsold-value-pane', name: 'มูลค่าขาย', numRows: 12 }, 
        { id: 'gift-value-pane', name: 'มูลค่าแถม', numRows: 8 }, 
        { id: 'discount-error-pane', name: 'ส่วนลด', numRows: 10 }, 
        { id: 'tax-error-pane', name: 'คำนวณภาษีผิดพลาด', numRows: 7 }, 
        { id: 'price-unit-error-pane', name: 'ขายผิดราคาและหน่วยนับ', numRows: 15 } 
    ]; 
    console.log("Smart Check System Initialized. Logic Revised (Sold+Gift Check).");
    
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const logoHomeBtn = document.getElementById('logoHomeBtn');
    const exportButtonSellOut = document.getElementById('exportSellOutBtn');
    const exportButtonAllError = document.getElementById('exportAllErrorBtn');

    let dailyChartInstance = null;
    let monthlyChartInstance = null;
    let monthlyMarginChartInstance = null; 

    let currentChecker = '';

    const employeeNames = [
      "(บุ๋ม) ศรุดา หอมขจร",
      "(เอ) สุทญา  สุจินพรหม",
      "(แหม่ม) ศุภิสรา  คชเวช",
      "(ชิง) ธัญศนันต์  บรรพบุรุษสกุล",
      "(โบว์) ณัฐฐ์ณิพา  ทรัพย์โสภณ",
      "(โบว์กี้) นลินี  ชวดสุวรรณ",
      "(แจ๊ส) วิมล มูลเดช",
      "(วิ) สุวิมล กลำภักดิ์",
      "(อุ๊) ภัควรรณ  ชะลอ",
      "(ปอ) ศุภรดา  ศุภรพงศ์",
      "(มล) นฤมล ชัยเพชร",
      "(น้ำ) ปาริชาติ ประเสริฐ",
      "(ฝ้าย) นฐา  ณ ระนอง"
    ].filter(name => name.trim() !== ''); 

    // Agents Data
    const agentsData = [
        { "isHeader": true, "text": "R1", "value": "R1" },
        { "isHeader": false, "text": "บจก.บิ๊กเบียร์", "value": "บจก.บิ๊กเบียร์" },
        { "isHeader": false, "text": "บจก.สินชัยการสุรา", "value": "บจก.สินชัยการสุรา" },
        { "isHeader": false, "text": "บจก.จ.เสริมทรัพย์", "value": "บจก.จ.เสริมทรัพย์" },
        { "isHeader": false, "text": "บจก.เพชรธงชัยเทรดดิ้ง", "value": "บจก.เพชรธงชัยเทรดดิ้ง" },
        { "isHeader": false, "text": "บจก.เอกะนาคา", "value": "บจก.เอกะนาคา" },
        { "isHeader": false, "text": "บจก.เพชรธำรงเทรดดิ้ง", "value": "บจก.เพชรธำรงเทรดดิ้ง" },
        { "isHeader": false, "text": "บจก.สินชัยเบฟเวอเรจ", "value": "บจก.สินชัยเบฟเวอเรจ" },
        { "isHeader": false, "text": "บจก.เบียร์และไวน์", "value": "บจก.เบียร์และไวน์" },
        { "isHeader": true, "text": "R2", "value": "R2" },
        { "isHeader": false, "text": "บจก.สหภัณฑ์พาณิชย์การค้าระยอง", "value": "บจก.สหภัณฑ์พาณิชย์การค้าระยอง" },
        { "isHeader": false, "text": "บจก.สุภาคอร์ปอเรชั่น", "value": "บจก.สุภาคอร์ปอเรชั่น" },
        { "isHeader": false, "text": "บจก.ช้างเฮ้าส์", "value": "บจก.ช้างเฮ้าส์" },
        { "isHeader": false, "text": "บจก.ฐานพัฒน์ธารา", "value": "บจก.ฐานพัฒน์ธารา" },
        { "isHeader": false, "text": "หจก.กบินทร์ปั้งง้วนหลี", "value": "หจก.กบินทร์ปั้งง้วนหลี" },
        { "isHeader": false, "text": "บจก.น้าวัฒนไพบูลย์", "value": "บจก.น้าวัฒนไพบูลย์" },
        { "isHeader": false, "text": "หจก.กุหลาบการสุราสอยดาว", "value": "หจก.กุหลาบการสุราสอยดาว" },
        { "isHeader": false, "text": "หจก.กุหลาบการสุราวังสมบูรณ์", "value": "หจก.กุหลาบการสุราวังสมบูรณ์" },
        { "isHeader": true, "text": "R3", "value": "R3" },
        { "isHeader": false, "text": "หจก.สันติชัยการสุรา", "value": "หจก.สันติชัยการสุรา" },
        { "isHeader": false, "text": "หจก.บุรีรัมย์ศรีสงวน", "value": "หจก.บุรีรัมย์ศรีสงวน" },
        { "isHeader": false, "text": "หจก.แสงรุ้งอุบล", "value": "หจก.แสงรุ้งอุบล" },
        { "isHeader": false, "text": "บจก.เค.เอ็น.บิสซิเนส", "value": "บจก.เค.เอ็น.บิสซิเนส" },
        { "isHeader": false, "text": "บจก.ยโสธรเบฟเวอเรจ", "value": "บจก.ยโสธรเบฟเวอเรจ" },
        { "isHeader": false, "text": "บจก.คลังเจริญ07", "value": "บจก.คลังเจริญ07" },
        { "isHeader": false, "text": "หจก.สมบัติ อ.พยุห์การสุรา", "value": "หจก.สมบัติ อ.พยุห์การสุรา" },
        { "isHeader": false, "text": "หจก.วิชชุดาการสุรา", "value": "หจก.วิชชุดาการสุรา" },
        { "isHeader": false, "text": "หจก.สุรกิจการสุรา", "value": "หจก.สุรกิจการสุรา" },
        { "isHeader": false, "text": "บจก.สิทธิตะวันออกเฉียงเหนือ", "value": "บจก.สิทธิตะวันออกเฉียงเหนือ" },
        { "isHeader": false, "text": "หจก.รุ่งรัตน์(ปรีชา)การพาณิชย์", "value": "หจก.รุ่งรัตน์(ปรีชา)การพาณิชย์" },
        { "isHeader": false, "text": "หจก.ฉัตรชัยเบฟเวอร์เรจ", "value": "หจก.ฉัตรชัยเบฟเวอร์เรจ" },
        { "isHeader": false, "text": "หจก.สุราสมทรัพย์เสลภูมิ", "value": "หจก.สุราสมทรัพย์เสลภูมิ" },
        { "isHeader": false, "text": "หจก.วอมาร์ทเทรดดิ้ง", "value": "หจก.วอมาร์ทเทรดดิ้ง" },
        { "isHeader": false, "text": "หจก.ปราสาทการสุรา", "value": "หจก.ปราสาทการสุรา" },
        { "isHeader": false, "text": "หจก.เมืองช้างการสุรา", "value": "หจก.เมืองช้างการสุรา" },
        { "isHeader": false, "text": "บจก.เพชรเกษม(อิสาน)", "value": "บจก.เพชรเกษม(อิสาน)" },
        { "isHeader": false, "text": "หจก.อุบลจินตวีร์", "value": "หจก.อุบลจินตวีร์" },
        { "isHeader": false, "text": "บจก.ยิ่งเจริญ99", "value": "บจก.ยิ่งเจริญ99" },
        { "isHeader": false, "text": "หจก.สุราจตุรพักตรพิมาน", "value": "หจก.สุราจตุรพักตรพิมาน" },
        { "isHeader": false, "text": "หจก.ช.สหทิพย์", "value": "หจก.ช.สหทิพย์" },
        { "isHeader": true, "text": "R4", "value": "R4" },
        { "isHeader": false, "text": "บจก.เติ้นหยง", "value": "บจก.เติ้นหยง" },
        { "isHeader": false, "text": "หจก.หนุ่มปากคาด", "value": "หจก.หนุ่มปากคาด" },
        { "isHeader": false, "text": "บจก.อุดรอาชากรุ๊ป", "value": "บจก.อุดรอาชากรุ๊ป" },
        { "isHeader": false, "text": "หจก.วิสันต์พาณิชย์(2002)", "value": "หจก.วิสันต์พาณิชย์(2002)" },
        { "isHeader": false, "text": "บจก.พลสยามเบฟเวอเรจ", "value": "บจก.พลสยามเบฟเวอเรจ" },
        { "isHeader": false, "text": "บจก.ส.วิวัฒน์การสุรา", "value": "บจก.ส.วิวัฒน์การสุรา" },
        { "isHeader": false, "text": "หจก.เอกชัยพานิช", "value": "หจก.เอกชัยพานิช" },
        { "isHeader": false, "text": "บจก.ไชโย(2001)", "value": "บจก.ไชโย(2001)" },
        { "isHeader": false, "text": "หจก.ขอนแก่นไทยยืนยง(2001)", "value": "หจก.ขอนแก่นไทยยืนยง(2001)" },
        { "isHeader": false, "text": "บจก.อุดรธนานนท์พลัสเบฟเวอเรจ", "value": "บจก.อุดรธนานนท์พลัสเบฟเวอเรจ" },
        { "isHeader": false, "text": "บจก.ฟาร์มมาร์ทเทรดดิ้ง", "value": "บจก.ฟาร์มมาร์ทเทรดดิ้ง" },
        { "isHeader": false, "text": "บจก.เอเคซีพลัส", "value": "บจก.เอเคซีพลัส" },
        { "isHeader": false, "text": "บจก.สินเบฟเวอเรจ", "value": "บจก.สินเบฟเวอเรจ" },
        { "isHeader": false, "text": "บจก.รัตนเทรดดิ้ง(2013)", "value": "บจก.รัตนเทรดดิ้ง(2013)" },
        { "isHeader": false, "text": "บจก.เด็กไทยค้าข้าวเทรดดิ้ง", "value": "บจก.เด็กไทยค้าข้าวเทรดดิ้ง" },
        { "isHeader": false, "text": "หจก.ชาตรีลิเคอร์", "value": "หจก.ชาตรีลิเคอร์" },
        { "isHeader": false, "text": "บจก.เตียเจริญเบฟเวอเรจ", "value": "บจก.เตียเจริญเบฟเวอเรจ" },
        { "isHeader": false, "text": "บจก.นครพนมเบฟเวอเรจ", "value": "บจก.นครพนมเบฟเวอเรจ" },
        { "isHeader": false, "text": "บจก.ยืนยงธาตุพนม", "value": "บจก.ยืนยงธาตุพนม" },
        { "isHeader": false, "text": "บจก.รวงข้าวพาณิชย์", "value": "บจก.รวงข้าวพาณิชย์" },
        { "isHeader": false, "text": "บจก.ช้างโซนาต้า", "value": "บจก.ช้างโซนาต้า" },
        { "isHeader": false, "text": "บจก.ขุนพลพาณิชย์(2018)", "value": "บจก.ขุนพลพาณิชย์(2018)" },
        { "isHeader": false, "text": "หจก.ตี๋เล็กพาณิชย์", "value": "หจก.ตี๋เล็กพาณิชย์" },
        { "isHeader": false, "text": "บจก.สมบัติกิจรุ่งเรืองกรุ๊ป", "value": "บจก.สมบัติกิจรุ่งเรืองกรุ๊ป" },
        { "isHeader": false, "text": "บจก.๙๙การสุรา", "value": "บจก.๙๙การสุรา" },
        { "isHeader": false, "text": "บจก.ทรัพย์มารุมเบฟเวอเรจ", "value": "บจก.ทรัพย์มารุมเบฟเวอเรจ" },
        { "isHeader": true, "text": "R5", "value": "R5" },
        { "isHeader": false, "text": "บจก.คลังชลทิพย์", "value": "บจก.คลังชลทิพย์" },
        { "isHeader": false, "text": "บจก.สุประเสริฐการค้า", "value": "บจก.สุประเสริฐการค้า" },
        { "isHeader": false, "text": "บจก.อีคอนแวร์เฮ้าส์", "value": "บจก.อีคอนแวร์เฮ้าส์" },
        { "isHeader": false, "text": "บจก.เอ็น.อาร์.เจริญกิจดิสทริบิวร์เตอร์", "value": "บจก.เอ็น.อาร์.เจริญกิจดิสทริบิวร์เตอร์" },
        { "isHeader": false, "text": "หจก.สดการสุรา", "value": "หจก.สดการสุรา" },
        { "isHeader": false, "text": "บจก.บ่อทองเครื่องดื่ม", "value": "บจก.บ่อทองเครื่องดื่ม" },
        { "isHeader": false, "text": "บจก.สุธีเครื่องดื่ม", "value": "บจก.สุธีเครื่องดื่ม" },
        { "isHeader": false, "text": "บจก.เชียงใหม่เพชรดา", "value": "บจก.เชียงใหม่เพชรดา" },
        { "isHeader": false, "text": "หจก.สุราสมพงษ์", "value": "หจก.สุราสมพงษ์" },
        { "isHeader": false, "text": "หจก.สมพงษ์การสุรา", "value": "หจก.สมพงษ์การสุรา" },
        { "isHeader": false, "text": "บจก.พิษณุโลกศรีชัยเจริญ2006", "value": "บจก.พิษณุโลกศรีชัยเจริญ2006" },
        { "isHeader": false, "text": "บจก.ปริ้นซ์การสุรา", "value": "บจก.ปริ้นซ์การสุรา" },
        { "isHeader": false, "text": "หจก.เจริญชัย2", "value": "หจก.เจริญชัย2" },
        { "isHeader": false, "text": "บจก.ศิริชัยการสุรา", "value": "บจก.ศิริชัยการสุรา" },
        { "isHeader": false, "text": "หจก.อภิชาติน้ำทิพย์", "value": "หจก.อภิชาติน้ำทิพย์" },
        { "isHeader": false, "text": "บจก.ซี เอ็น เบฟเวอเรจ เชียงใหม่", "value": "บจก.ซี เอ็น เบฟเวอเรจ เชียงใหม่" },
        { "isHeader": false, "text": "หจก.ชาติจันทิพย์", "value": "หจก.ชาติจันทิพย์" },
        { "isHeader": false, "text": "หจก.โตชิงชัย", "value": "หจก.โตชิงชัย" },
        { "isHeader": true, "text": "R6", "value": "R6" },
        { "isHeader": false, "text": "บจก.ปราสาททองการสุรา", "value": "บจก.ปราสาททองการสุรา" },
        { "isHeader": false, "text": "หจก.รุ่งเรืองกิจการสุรา(2006)", "value": "หจก.รุ่งเรืองกิจการสุรา(2006)" },
        { "isHeader": false, "text": "บจก.ขวัญใจพานิช(555)", "value": "บจก.ขวัญใจพานิช(555)" },
        { "isHeader": false, "text": "หจก.ท่าพลเซอร์วิส", "value": "หจก.ท่าพลเซอร์วิส" },
        { "isHeader": false, "text": "บจก.ซุ่ยฮงจั่นสระบุรี", "value": "บจก.ซุ่ยฮงจั่นสระบุรี" },
        { "isHeader": false, "text": "หจก.ลูกจันทร์เครื่องดื่ม2024", "value": "หจก.ลูกจันทร์เครื่องดื่ม2024" },
        { "isHeader": false, "text": "บจก.ธนากรลิเคอร์(2539)", "value": "บจก.ธนากรลิเคอร์(2539)" },
        { "isHeader": false, "text": "หจก.สุวรรณสภาคการสุรา", "value": "หจก.สุวรรณสภาคการสุรา" },
        { "isHeader": false, "text": "หจก.ดอกรักรุ่งเรือง", "value": "หจก.ดอกรักรุ่งเรือง" },
        { "isHeader": false, "text": "หจก.พิจิตรเครื่องดื่ม(2009)", "value": "หจก.พิจิตรเครื่องดื่ม(2009)" },
        { "isHeader": false, "text": "บจก.แก้วสมบุญ555", "value": "บจก.แก้วสมบุญ555" },
        { "isHeader": false, "text": "หจก.วานิชโสภณ", "value": "หจก.วานิชโสภณ" },
        { "isHeader": false, "text": "บจก.วิจิตรเจริญแอนด์ซัน", "value": "บจก.วิจิตรเจริญแอนด์ซัน" },
        { "isHeader": false, "text": "หจก.ศรีเชย", "value": "หจก.ศรีเชย" },
        { "isHeader": false, "text": "บจก.พิมพ์ทวี", "value": "บจก.พิมพ์ทวี" },
        { "isHeader": false, "text": "บจก.โชคสมพงษ์(555)", "value": "บจก.โชคสมพงษ์(555)" },
        { "isHeader": false, "text": "หจก.รุ่งศักดิ์การสุรา", "value": "หจก.รุ่งศักดิ์การสุรา" },
        { "isHeader": false, "text": "บจก.อธิชาการสุรา", "value": "บจก.อธิชาการสุรา" },
        { "isHeader": true, "text": "R7", "value": "R7" },
        { "isHeader": false, "text": "บจก.สิริวงศ์ทรัพย์", "value": "บจก.สิริวงศ์ทรัพย์" },
        { "isHeader": false, "text": "บจก.ซีเคซี", "value": "บจก.ซีเคซี" },
        { "isHeader": false, "text": "บจก.สหพรรษนคร", "value": "บจก.สหพรรษนคร" },
        { "isHeader": false, "text": "บจก.รัตนไพบูลย์สมุทรสงคราม2555", "value": "บจก.รัตนไพบูลย์สมุทรสงคราม2555" },
        { "isHeader": false, "text": "หจก.เอกจิตต์พานิช", "value": "หจก.เอกจิตต์พานิช" },
        { "isHeader": false, "text": "หจก.เอส.ที.เจ.การค้า", "value": "หจก.เอส.ที.เจ.การค้า" },
        { "isHeader": false, "text": "บจก.เซ็บแฟมิลี่", "value": "บจก.เซ็บแฟมิลี่" },
        { "isHeader": false, "text": "บจก.ศักดิ์สุภา", "value": "บจก.ศักดิ์สุภา" },
        { "isHeader": false, "text": "บจก.ทุนนอน", "value": "บจก.ทุนนอน" },
        { "isHeader": false, "text": "บจก.วรวิชเทรดดิ้ง", "value": "บจก.วรวิชเทรดดิ้ง" },
        { "isHeader": false, "text": "บจก.ขายถูก", "value": "บจก.ขายถูก" },
        { "isHeader": false, "text": "นายนิพนธ์พัดกระจ่าง", "value": "นายนิพนธ์พัดกระจ่าง" },
        { "isHeader": false, "text": "บจก.สมภาโชค", "value": "บจก.สมภาโชค" },
        { "isHeader": false, "text": "หจก.อ.วัฒนากิจ", "value": "หจก.อ.วัฒนากิจ" },
        { "isHeader": false, "text": "หจก.ท่ายางค้าส่ง", "value": "หจก.ท่ายางค้าส่ง" },
        { "isHeader": false, "text": "หจก.ให้เจริญรุ่มรวย", "value": "หจก.ให้เจริญรุ่มรวย" },
        { "isHeader": false, "text": "หจก.ระรุ่งเรือง", "value": "หจก.ระรุ่งเรือง" },
        { "isHeader": false, "text": "หจก.บางช้างการค้า", "value": "หจก.บางช้างการค้า" },
        { "isHeader": false, "text": "หจก.เลาขวัญการสุรา", "value": "หจก.เลาขวัญการสุรา" },
        { "isHeader": false, "text": "หจก.สมพงษ์พานิชกุยบุรี", "value": "หจก.สมพงษ์พานิชกุยบุรี" },
        { "isHeader": true, "text": "R8", "value": "R8" },
        { "isHeader": false, "text": "บจก.กระบี่บ้านช้าง", "value": "บจก.กระบี่บ้านช้าง" },
        { "isHeader": false, "text": "หจก.สุราษฎร์ทรัพย์ศิริ2002", "value": "หจก.สุราษฎร์ทรัพย์ศิริ2002" },
        { "isHeader": false, "text": "บจก.หลินเอ็นเตอร์ไพรส์", "value": "บจก.หลินเอ็นเตอร์ไพรส์" },
        { "isHeader": false, "text": "บจก.คลองแหการสุรา", "value": "บจก.คลองแหการสุรา" },
        { "isHeader": false, "text": "หจก.ชุมพรเล็กแกฮะ", "value": "หจก.ชุมพรเล็กแกฮะ" },
        { "isHeader": false, "text": "บจก.ไอดริ้งค์เทรดดิ้ง", "value": "บจก.ไอดริ้งค์เทรดดิ้ง" },
        { "isHeader": false, "text": "หจก.พระพรหมการค้า", "value": "หจก.พระพรหมการค้า" },
        { "isHeader": false, "text": "บจก.ท้ายสำเภา2003", "value": "บจก.ท้ายสำเภา2003" },
        { "isHeader": false, "text": "หจก.ปลาเม่น2554", "value": "หจก.ปลาเม่น2554" },
        { "isHeader": false, "text": "หจก.ทัน.ย่อเซ่ง การค้า", "value": "หจก.ทัน.ย่อเซ่ง การค้า" },
        { "isHeader": false, "text": "หจก.ท่าชนะพาณิชย์", "value": "หจก.ท่าชนะพาณิชย์" },
        { "isHeader": false, "text": "บจก.เฟิร์สวิน", "value": "บจก.เฟิร์สวิน" },
        { "isHeader": false, "text": "บจก.นิวณัฏฐา", "value": "บจก.นิวณัฏฐา" },
        { "isHeader": false, "text": "หจก.ฮกซิ่งลึงพาณิชย์", "value": "หจก.ฮกซิ่งลึงพาณิชย์" },
        { "isHeader": false, "text": "-----", "value": "-----" }
    ];

    const DECIMAL_FORMAT = { minimumFractionDigits: 2, maximumFractionDigits: 2 };

    // [CORE] Sales Data Store
    let combinedSalesData = []; 
    // Ref Price Data Store
    let referencePriceData = [];
    
    // Pagination Configuration
    let currentPage = 1;
    let currentRefPage = 1;
    // Pagination for Additional Check
    let currentAddCheckPage = 1;
    const ITEMS_PER_PAGE = 100;

    // =================================================================
    // DATA PROCESSING FUNCTIONS
    // =================================================================

    function mapExcelRowToTransaction(row, docType) {
        const getString = (val) => (val !== undefined && val !== null) ? val.toString().trim() : "";
        const getNumber = (val) => {
            if (val === undefined || val === null) return 0;
            if (typeof val === 'number') return val;
            const cleanStr = val.toString().replace(/,/g, '').trim();
            return parseFloat(cleanStr) || 0;
        };

        return {
            doc_date:      getString(row.A),  
            doc_no:        getString(row.B),  
            debtor_name:   getString(row.C),  
            prod_code:     getString(row.D),  
            prod_name:     getString(row.E),  
            unit:          getString(row.F),  
            qty_sold:      getNumber(row.G),  
            qty_gift:      getNumber(row.H),  
            price_per_unit:getNumber(row.I),  
            item_disc:     getNumber(row.J),  
            item_total:    getNumber(row.K),  
            bill_disc:     getNumber(row.L),  
            marketing_disc:getNumber(row.M),  
            product_value: getNumber(row.N),  
            vat_rate:      getNumber(row.O),  
            total_value:   getNumber(row.P),
            tax_type:      getString(row.R),
            
            is_error: false, 
            error_type: '-'
        };
    }

    function mapRefPriceRow(row) {
        const getString = (val) => (val !== undefined && val !== null) ? val.toString().trim() : "";
        const getNumber = (val) => {
            if (val === undefined || val === null) return 0;
            if (typeof val === 'number') return val;
            const cleanStr = val.toString().replace(/,/g, '').trim();
            return parseFloat(cleanStr) || 0;
        };

        return {
            code: getString(row.A), 
            name: getString(row.B), 
            unit: getString(row.C), 
            price: getNumber(row.D) 
        };
    }

    function readExcelFile(file, docType) {
        return new Promise((resolve, reject) => {
            if (!file) return resolve([]);

            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    // [CORE] Add codepage 874 for Thai Language Support
                    const workbook = XLSX.read(data, { type: 'array', codepage: 874 });
                    
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: "A", range: 1, defval: "" });
                    
                    let transactions = [];
                    if (docType === 'ref_price') {
                        transactions = jsonData.map(row => mapRefPriceRow(row));
                    } else {
                        transactions = jsonData.map(row => mapExcelRowToTransaction(row, docType));
                    }
                    resolve(transactions);

                } catch (err) {
                    console.error("Error reading Excel file:", err);
                    reject("Failed to parse Excel file: " + file.name);
                }
            };

            reader.onerror = (err) => reject("File reading error: " + err);
            reader.readAsArrayBuffer(file);
        });
    }

    // =================================================================
    // HELPER FUNCTIONS
    // =================================================================
    
    // ฟังก์ชันช่วยค้นหาข้อมูลจาก Data Set โดยตรง (ค้นหาข้ามหน้าได้)
    function getFilteredData(allData, tbodyId) {
        const input = document.querySelector(`input[data-target-tbody="${tbodyId}"]`);
        if (!input) return allData;
        
        const searchText = input.value.toLowerCase().trim();
        if (!searchText) return allData;
        
        // แยกคำค้นหาด้วยช่องว่าง เพื่อให้ค้นหาได้หลายคำ
        const terms = searchText.split(/\s+/).filter(t => t.length > 0);
        
        return allData.filter(item => {
            // รวมข้อมูลทุก Field เป็นข้อความเดียวเพื่อค้นหา
            const itemValues = Object.values(item).join(' ').toLowerCase();
            // ต้องเจอทุกคำที่พิมพ์ (AND logic)
            return terms.every(term => itemValues.includes(term));
        });
    }

    // Helper สำหรับปัดเศษทศนิยม 2 ตำแหน่งแบบบัญชี (Round Half Up)
    const round2 = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

    // =================================================================
    // UI LOGIC
    // =================================================================

    function toggleSidebarLock(checkerName) {
        const isLocked = !checkerName || checkerName.trim() === '' || checkerName.trim() === '-- กรุณาเลือกชื่อ --';
        sidebarLinks.forEach(button => {
            if (button.getAttribute('data-bs-target') === '#content-welcome') return;
            if (isLocked) {
                button.classList.add('disabled-link');
                button.setAttribute('aria-disabled', 'true');
            } else {
                button.classList.remove('disabled-link');
                button.removeAttribute('aria-disabled');
            }
        });
    }

    function updateAlert(checkerName) {
        const alertBox = document.getElementById('checkerAlert');
        if (!alertBox) return;
        if (!checkerName || checkerName.trim() === '' || checkerName.trim() === '-- กรุณาเลือกชื่อ --') {
            alertBox.classList.add('alert-danger-light', 'border');
            alertBox.classList.remove('alert-success-light');
            alertBox.querySelector('p').classList.add('text-danger');
            alertBox.querySelector('p').classList.remove('text-success');
            alertBox.querySelector('p').innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2"></i> กรุณาเลือกชื่อผู้ตรวจสอบ';
        } else {
            alertBox.classList.remove('alert-danger-light', 'border');
            alertBox.classList.add('alert-success-light');
            alertBox.querySelector('p').classList.remove('text-danger');
            alertBox.querySelector('p').classList.add('text-success');
            alertBox.querySelector('p').innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> ยินดีต้อนรับ คุณ${checkerName.split(') ').pop()}`;
        }
    }

    function loadCheckerNames() {
        const selectElement = document.getElementById('checkerSelect');
        selectElement.innerHTML = '<option value="" selected disabled>-- กรุณาเลือกชื่อ --</option>';
        employeeNames.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            selectElement.appendChild(option);
        });
        selectElement.value = ""; 
        currentChecker = ""; 
        updateAlert(currentChecker);
        toggleSidebarLock(currentChecker);
        selectElement.addEventListener('change', function() {
            currentChecker = this.value;
            updateAlert(currentChecker);
            toggleSidebarLock(currentChecker);
        });
    }
    
    function loadAgentNames() {
        const selectElement = document.getElementById('agentSelect');
        selectElement.innerHTML = '<option value="" selected disabled>-- กรุณาเลือกเอเย่นต์ --</option>';
        let currentGroup = null;

        agentsData.forEach(item => {
            if (item.isHeader) {
                currentGroup = document.createElement('optgroup');
                currentGroup.label = item.text;
                selectElement.appendChild(currentGroup);
            } else {
                const option = document.createElement('option');
                option.value = item.value;
                option.textContent = item.text;
                if (currentGroup) {
                    currentGroup.appendChild(option);
                } else {
                    selectElement.appendChild(option);
                }
            }
        });
    }

    function renderPaginationControls(containerId, currentPageNum, totalPages, renderCallback) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = ''; 

        if (totalPages <= 1) return; 

        const firstBtn = document.createElement('button');
        firstBtn.className = 'btn btn-sm btn-outline-secondary';
        firstBtn.innerHTML = '<i class="bi bi-chevron-double-left"></i>';
        firstBtn.title = 'หน้าแรก';
        firstBtn.disabled = currentPageNum === 1;
        firstBtn.onclick = () => {
            if (currentPageNum > 1) {
                renderCallback(1);
            }
        };
        container.appendChild(firstBtn);

        const prevBtn = document.createElement('button');
        prevBtn.className = 'btn btn-sm btn-outline-secondary ms-1';
        prevBtn.innerHTML = '<i class="bi bi-chevron-left"></i> ก่อนหน้า';
        prevBtn.disabled = currentPageNum === 1;
        prevBtn.onclick = () => {
            if (currentPageNum > 1) {
                renderCallback(currentPageNum - 1);
            }
        };
        container.appendChild(prevBtn);

        const pageInfo = document.createElement('span');
        pageInfo.className = 'mx-2 text-muted small';
        pageInfo.textContent = `หน้า ${currentPageNum} / ${totalPages}`;
        container.appendChild(pageInfo);

        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn-sm btn-outline-secondary me-1';
        nextBtn.innerHTML = 'ถัดไป <i class="bi bi-chevron-right"></i>';
        nextBtn.disabled = currentPageNum === totalPages;
        nextBtn.onclick = () => {
            if (currentPageNum < totalPages) {
                renderCallback(currentPageNum + 1);
            }
        };
        container.appendChild(nextBtn);

        const lastBtn = document.createElement('button');
        lastBtn.className = 'btn btn-sm btn-outline-secondary';
        lastBtn.innerHTML = '<i class="bi bi-chevron-double-right"></i>';
        lastBtn.title = 'หน้าสุดท้าย';
        lastBtn.disabled = currentPageNum === totalPages;
        lastBtn.onclick = () => {
            if (currentPageNum < totalPages) {
                renderCallback(totalPages);
            }
        };
        container.appendChild(lastBtn);
    }

    function generateReportTableHtml(rawData, paneId) {
        if (rawData.length === 0) {
            const colspan = (paneId === 'total-value-pane') ? 18 : 15; 
            return `<tr><td colspan="${colspan}" class="text-center text-muted py-4"><i class="bi bi-x-circle-fill me-2"></i>ไม่พบข้อมูลบิลขาย หรือ ข้อมูลถูกเคลียร์แล้ว กรุณานำเข้าข้อมูลใหม่</td></tr>`;
        }
        let html = '';
        const formatCurrency = (val) => (typeof val !== 'number') ? val : val.toLocaleString(undefined, DECIMAL_FORMAT);
        const reducedColumnsPanes = ['unsold-value-pane', 'gift-value-pane', 'discount-error-pane', 'tax-error-pane', 'price-unit-error-pane'];
        const isReduced = reducedColumnsPanes.includes(paneId);

        rawData.forEach(row => {
            const rowClass = row.is_error ? 'table-danger-light' : '';
            const resultIcon = row.is_error ? '<i class="bi bi-x-circle-fill text-danger" title="มีข้อผิดพลาด"></i>' : '<i class="bi bi-check-circle-fill text-success" title="ถูกต้อง"></i>';
            let vatDisplay = row.vat_rate;
            if (vatDisplay < 1 && vatDisplay > 0) vatDisplay = vatDisplay * 100;

            html += `<tr class="${rowClass}"><td>${row.doc_date}</td><td>${row.doc_no}</td>`;
            if (!isReduced) { html += `<td title="${row.debtor_name}">${row.debtor_name}</td><td>${row.prod_code}</td>`; }
            html += `<td title="${row.prod_name}">${row.prod_name}</td><td class="text-start">${row.unit}</td>
                    <td class="text-end">${formatCurrency(row.qty_sold)}</td><td class="text-end">${formatCurrency(row.qty_gift)}</td>
                    <td class="text-end">${formatCurrency(row.price_per_unit)}</td><td class="text-end text-danger">${formatCurrency(row.item_disc)}</td>
                    <td class="text-end">${formatCurrency(row.item_total)}</td><td class="text-end text-danger">${formatCurrency(row.bill_disc)}</td>
                    <td class="text-end text-danger">${formatCurrency(row.marketing_disc)}</td><td class="text-end">${formatCurrency(row.product_value)}</td>
                    <td class="text-end">${formatCurrency(vatDisplay)}</td><td class="text-end fw-bold">${formatCurrency(row.total_value)}</td>`;
            if (!isReduced) { html += `<td class="text-center">${row.tax_type || '-'}</td>`; }
            html += `<td class="text-center">${resultIcon}</td></tr>`;
        });
        return html;
    }

    function generateAdditionalCheckTableHtml(rawData) {
        if (rawData.length === 0) {
             return '<tr><td colspan="8" class="text-center text-muted py-4"><i class="bi bi-info-circle-fill me-2"></i>ไม่พบข้อมูลบิลขาย</td></tr>';
        }
        let html = '';
        const formatCurrency = (val) => (typeof val !== 'number') ? val : val.toLocaleString(undefined, DECIMAL_FORMAT);

        rawData.forEach(row => {
            const isError = (row.result === 'error');
            const resultIcon = isError ? '<i class="bi bi-x-circle-fill text-danger"></i>' : '<i class="bi bi-check-circle-fill text-success"></i>';
            const detectedText = isError ? row.detected : '-';
            const detectedClass = isError ? 'text-danger' : 'text-success';

            html += `
                <tr>
                    <td>${row.doc_date}</td>
                    <td>${row.doc_no}</td>
                    <td title="${row.prod_name}">${row.prod_name}</td>
                    <td class="text-start">${row.unit}</td>
                    <td class="text-end fw-bold">${formatCurrency(row.total_value)}</td>
                    <td class="text-center">${row.tax_type || '-'}</td>
                    <td class="text-center">${resultIcon}</td>
                    <td class="text-center ${detectedClass}">${detectedText}</td>
                </tr>
            `;
        });
        return html;
    }

    function generateRefPriceTableHtml(rawData) {
        if (rawData.length === 0) return '<tr><td colspan="5" class="text-center text-muted py-4"><i class="bi bi-info-circle-fill me-2"></i>ไม่พบข้อมูลโครงสร้างราคา</td></tr>';
        let html = '';
        const formatCurrency = (val) => (typeof val !== 'number') ? val : val.toLocaleString(undefined, DECIMAL_FORMAT);
        rawData.forEach(row => {
            let priceBeforeVat = row.price ? row.price / 1.07 : 0;
            html += `<tr><td>${row.code}</td><td>${row.name}</td><td class="text-start">${row.unit}</td><td class="text-end">${formatCurrency(row.price)}</td><td class="text-end">${formatCurrency(priceBeforeVat)}</td></tr>`;
        });
        return html;
    }

    function renderReportTable(paneId) {
        const tbodyId = (paneId === 'bc-summary-pane') ? 'bc-summary-body' : (paneId === 'bc-item-pane') ? 'bc-item-body' : paneId + '-body';
        
        if(paneId === 'additional-check-pane') {
            const tbody = document.getElementById('additional-check-body');
            if (!tbody) return;

            // Function Helper to Normalize String (Trim & Lowercase)
            const cleanStr = (s) => String(s || '').trim().toLowerCase();

            // Process Data with Step 1, 2, 3 Logic
            const processedData = combinedSalesData.map(row => {
                let status = 'success';
                let detectedMsg = '-';
                
                const taxType = (row.tax_type || '').toString().trim();
                const EPSILON = 0.10; // Increased tolerance for rounding errors

                // --- Step 1: Tax Type = 3 ---
                if (taxType === '3') {
                    // Case 1: มีของแถม
                    if (row.qty_gift > 0) {
                        // Case 1.1: แถม + ขาย (Mix)
                        if (row.qty_sold > 0) {
                            const totalQty = row.qty_sold + row.qty_gift;
                            const allDiscounts = row.item_disc + row.bill_disc + row.marketing_disc;
                            
                            // คำนวณราคาเต็มเหมือนขายทุกชิ้น
                            const calcFullCharge = (totalQty * row.price_per_unit) - allDiscounts;
                            
                            // ถ้า Total Value ในบิล เท่ากับ ราคาเต็ม (แปลว่าคิดเงินค่าของแถมด้วย) -> ผิด
                            if (Math.abs(calcFullCharge - row.total_value) < EPSILON) { // ใช้ < EPSILON คือเท่ากัน
                                status = 'error';
                                detectedMsg = 'มีการคิดมูลค่าสินค้าแถม'; 
                            } 
                            // ถ้าไม่เท่ากัน (ปกติ Total Value ควรน้อยกว่าเพราะไม่ได้คิดค่าแถม) -> ถูกต้อง (Pass)
                        } 
                        // Case 1.2: แถมล้วนๆ (ขาย = 0)
                        else {
                            // ตรวจ VAT ต้องเป็น 0
                            if (row.vat_rate > 0 || row.product_value > 0) {
                                status = 'error';
                                detectedMsg = 'มีการคิดมูลค่าสินค้าแถม';
                            }
                        }
                    } 
                    // Case 2: ไม่มีของแถม (Check Price Reference ปกติ)
                    else {
                        if (status === 'success') {
                            // Use FILTER instead of FIND to get ALL matches
                            const allRefMatches = referencePriceData.filter(ref => 
                                cleanStr(ref.code) === cleanStr(row.prod_code) && 
                                cleanStr(ref.unit) === cleanStr(row.unit)
                            );

                            if (allRefMatches.length === 0) {
                                status = 'error';
                                detectedMsg = 'ตรวจราคาอ้างอิง (ไม่พบสินค้า)';
                            } else {
                                // Check if ANY of the found matches fit the bill price
                                const priceInBill = row.price_per_unit;
                                let isPriceFound = false;

                                for (const ref of allRefMatches) {
                                    const refPrice = ref.price;
                                    
                                    // Check 1: Exact Match
                                    const diffExact = Math.abs(refPrice - priceInBill);
                                    // Check 2: Bill is Base, Ref is Incl VAT
                                    const refBase = refPrice / 1.07;
                                    const diffVat1 = Math.abs(refBase - priceInBill);
                                    // Check 3: Bill is Base, Ref is Incl VAT (Alt calc)
                                    const billInclVat = priceInBill * 1.07;
                                    const diffVat2 = Math.abs(refPrice - billInclVat);

                                    if (diffExact <= EPSILON || diffVat1 <= EPSILON || diffVat2 <= EPSILON) {
                                        isPriceFound = true;
                                        break; // Found a valid match, stop looking
                                    }
                                }

                                if (!isPriceFound) {
                                    status = 'error';
                                    // Show the price of the first match for context
                                    detectedMsg = `ราคาไม่ตรง (บิล:${priceInBill} vs อ้างอิง:${allRefMatches[0].price})`;
                                }
                            }
                        }
                    }
                }
                // --- Step 2: Tax Type = 1 ---
                else if (taxType === '1') {
                    // 2.1 Check Calculation Consistency
                    const calcProductVal = row.qty_sold * row.price_per_unit;
                    const isValValid = Math.abs(row.product_value - calcProductVal) < EPSILON;
                    const isTotalValid = Math.abs(row.product_value - row.total_value) < EPSILON;

                    if (!isValValid || !isTotalValid) {
                        status = 'error';
                        detectedMsg = 'สินค้า No-VAT: มีการคิดมูลค่า ภพ. หรือคำนวณผิด';
                    }

                    // 2.2 Check VAT must be 0
                    if (status === 'success') {
                        if (Math.abs(row.vat_rate) > 0) {
                            status = 'error';
                            detectedMsg = 'ภาษีต้องเป็น 0 (Step 2.2)';
                        }
                    }
                }

                // --- Step 3: Final Formula Check (UPDATED: Two Calculation Methods) ---
                if (status === 'success') {
                    // ถ้ามีของแถมในเคส Tax 3 เราข้ามการตรวจสูตรนี้ไปเลย เพราะสูตรนี้จะขัดแย้งกับ Logic ใหม่ของ User
                    // (Logic ใหม่ User บอกว่า ห้ามเท่ากัน แต่สูตรนี้ปกติจะเช็คว่าต้องเท่ากัน)
                    if (taxType === '3' && row.qty_gift > 0) {
                        // Skip Step 3 for Gift Items in Tax Type 3
                    } else {
                        const totalQty = row.qty_sold + row.qty_gift;
                        const discountTotal = row.item_disc + row.bill_disc + row.marketing_disc;

                        // Method 1: Standard Calculation (Full Precision)
                        const calcStandard = (totalQty * row.price_per_unit) - discountTotal;
                        const validStandard = Math.abs(calcStandard - row.total_value) <= EPSILON;

                        // Method 2: Accounting Calculation (Round Gross First)
                        const grossRounded = round2(totalQty * row.price_per_unit);
                        const calcAccounting = grossRounded - discountTotal;
                        const validAccounting = Math.abs(calcAccounting - row.total_value) <= EPSILON;
                        
                        // If NEITHER method matches, flag as error
                        if (!validStandard && !validAccounting) {
                            status = 'error';
                            if (taxType === '3') detectedMsg = 'คำนวณผิดพลาด (Step 3)';
                            else if (taxType === '1') detectedMsg = 'คำนวณผิดพลาด (Step 3)';
                            else detectedMsg = 'คำนวณผิดพลาด (Step 3)';
                        }
                    }
                }

                return { 
                    ...row, 
                    result: status, 
                    detected: detectedMsg 
                };
            });

            // ** กรองข้อมูลสำหรับแท็บผิดพลาด (Data Filter) **
            const filteredAddData = getFilteredData(processedData, 'additional-check-body');

            const totalPages = Math.ceil(filteredAddData.length / ITEMS_PER_PAGE);
            
            // Reset to page 1 if search result is small
            if (currentAddCheckPage > totalPages) currentAddCheckPage = 1;
            if (totalPages > 0 && currentAddCheckPage === 0) currentAddCheckPage = 1;

            const startIndex = (currentAddCheckPage - 1) * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            const dataToRender = filteredAddData.slice(startIndex, endIndex);
            
            renderPaginationControls('additional-check-pagination', currentAddCheckPage, totalPages, (newPage) => {
                currentAddCheckPage = newPage;
                renderReportTable('additional-check-pane');
            });
            tbody.innerHTML = generateAdditionalCheckTableHtml(dataToRender);
            return;
        }

        const tbody = document.getElementById(tbodyId);
        if (!tbody) return;

        if (paneId === 'bc-summary-pane') {
             tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4"><i class="bi bi-info-circle-fill me-2"></i>ไม่พบข้อมูลบิลขายต่ำกว่าทุน</td></tr>';
            return;
        }
        
        // ** กรองข้อมูลหลัก (Data Filter) **
        const allData = combinedSalesData;
        const filteredData = getFilteredData(allData, tbodyId);
        
        if (paneId === 'total-value-pane') {
            const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
            
            // Reset to page 1 if search result is small
            if (currentPage > totalPages) currentPage = 1; 
            if (totalPages > 0 && currentPage === 0) currentPage = 1;

            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            const dataToRender = filteredData.slice(startIndex, endIndex);
            
            renderPaginationControls('pagination-container', currentPage, totalPages, (newPage) => {
                currentPage = newPage;
                renderReportTable('total-value-pane');
            });
            tbody.innerHTML = generateReportTableHtml(dataToRender, paneId);
        } else {
             // สำหรับแท็บย่อยอื่น ๆ
             tbody.innerHTML = generateReportTableHtml(filteredData, paneId);
        }
    }

    function renderRefPriceTable() {
        const tbody = document.getElementById('ref-price-body');
        if (!tbody) return;
        
        // ** กรองข้อมูลโครงสร้างราคา (Data Filter) **
        const filteredData = getFilteredData(referencePriceData, 'ref-price-body');

        const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
        
        // Reset to page 1 if search result is small
        if (currentRefPage > totalPages) currentRefPage = 1;
        if (totalPages > 0 && currentRefPage === 0) currentRefPage = 1;

        const startIndex = (currentRefPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const dataToRender = filteredData.slice(startIndex, endIndex);
        
        renderPaginationControls('ref-price-pagination', currentRefPage, totalPages, (newPage) => {
            currentRefPage = newPage;
            renderRefPriceTable();
        });
        tbody.innerHTML = generateRefPriceTableHtml(dataToRender);
    }

    function setupGlobalSearch() {
        const searchInputs = document.querySelectorAll('.table-search-input');
        searchInputs.forEach(input => {
            input.addEventListener('keyup', function(e) {
                const targetBody = this.getAttribute('data-target-tbody');
                
                // เมื่อพิมพ์ค้นหา ให้รีเซ็ตหน้าเป็นหน้า 1 แล้วสั่งวาดตารางใหม่ (Re-render with Filter)
                if (targetBody === 'ref-price-body') {
                    currentRefPage = 1;
                    renderRefPriceTable();
                } else if (targetBody === 'additional-check-body') {
                    currentAddCheckPage = 1;
                    renderReportTable('additional-check-pane');
                } else if (targetBody === 'total-value-pane-body') {
                    currentPage = 1;
                    renderReportTable('total-value-pane');
                } else {
                    // สำหรับแท็บย่อยอื่นๆ
                    const paneId = targetBody.replace('-body', ''); 
                    renderReportTable(paneId);
                }
            });
            
            // ป้องกันการกด Enter แล้ว Refresh หน้า
            input.addEventListener('keydown', function(e) { 
                if (e.key === 'Enter') { e.preventDefault(); } 
            });
        });
        
        const searchBtns = document.querySelectorAll('.table-search-btn');
        searchBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const inputGroup = this.closest('.input-group');
                const input = inputGroup.querySelector('.table-search-input');
                if(input) { input.dispatchEvent(new Event('keyup')); }
            });
        });
    }

    function handleTabContentRender(targetId, paneId) {
        setTimeout(() => {
            if (targetId === '#content-sell-out') {
                // ...
            } else if (targetId === '#content-error-check') {
                const refTab = document.getElementById('ref-price-tab');
                const addTab = document.getElementById('additional-check-tab');
                if(refTab && refTab.classList.contains('active')) {
                    renderRefPriceTable();
                } else if(addTab && addTab.classList.contains('active')) {
                    renderReportTable('additional-check-pane');
                } else {
                    renderReportTable('total-value-pane');
                }
            }
        }, 10); 
    }

    sidebarLinks.forEach(button => {
        button.addEventListener('click', function(e) { 
            const targetId = this.getAttribute('data-bs-target');
            if (targetId !== '#content-welcome' && (!currentChecker || currentChecker.trim() === '' || currentChecker.trim() === '-- กรุณาเลือกชื่อ --')) {
                e.preventDefault();
                alert('กรุณาเลือกชื่อผู้ตรวจสอบระบบก่อนเริ่มต้นใช้งานเมนูอื่นๆ');
                return;
            }
            sidebarLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            const targetPane = document.querySelector(targetId);
            const mainTabContent = document.getElementById('mainTabContent');
            mainTabContent.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('show', 'active'));
            if (targetPane) {
                targetPane.classList.add('show', 'active');
                handleTabContentRender(targetId, targetId.replace('#', ''));
            }
        });
    });

    if (logoHomeBtn) {
        logoHomeBtn.addEventListener('click', function() {
            const homeBtn = document.querySelector('[data-bs-target="#content-welcome"]');
            if(homeBtn) homeBtn.click(); 
        });
    }

    function exportToExcel(data, filename) {
        const agentSelect = document.getElementById('agentSelect');
        const agentName = agentSelect.selectedIndex > 0 ? agentSelect.options[agentSelect.selectedIndex].text : "-";
        const checkerSelect = document.getElementById('checkerSelect');
        const checkerName = checkerSelect.selectedIndex > 0 ? checkerSelect.options[checkerSelect.selectedIndex].text : "-";
        const exportTime = new Date().toLocaleString('th-TH');
        const headerRows = [ [{ v: "รายงานตรวจสอบความถูกต้องในการเปิดบิลขาย", t: 's' }], [{ v: "ชื่อเอเย่นต์ : " + agentName, t: 's' }], [{ v: "ชื่อผู้ตรวจสอบ : " + checkerName, t: 's' }], [{ v: "วันที่และเวลา : " + exportTime, t: 's' }], [] ];
        const tableHeaders = [ "วันที่เอกสาร", "เลขที่เอกสาร", "ชื่อลูกหนี้", "รหัสสินค้า", "รายการสินค้า", "หน่วยนับ", "ขาย", "แถม", "ราคา@", "ส่วนลด/รายการ", "ยอดเงิน", "ส่วนลดท้ายบิล", "ส่วนลดการตลาด", "มูลค่าสินค้า", "ภพ.", "มูลค่าทั้งสิ้น", "ประเภทภาษี", "สถานะ" ];
        const tableData = data.map(row => [ row.doc_date, row.doc_no, row.debtor_name, row.prod_code, row.prod_name, row.unit, row.qty_sold, row.qty_gift, row.price_per_unit, row.item_disc, row.item_total, row.bill_disc, row.marketing_disc, row.product_value, row.vat_rate * 100, row.total_value, row.tax_type, row.is_error ? "พบข้อผิดพลาด" : "ปกติ" ]);
        const wsData = [...headerRows, tableHeaders, ...tableData];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            for (let R = range.s.r; R <= range.e.r; ++R) {
                const cell_ref = XLSX.utils.encode_cell({ c: C, r: R });
                if (!ws[cell_ref]) continue;
                if (!ws[cell_ref].s) ws[cell_ref].s = {};
                ws[cell_ref].s.font = { sz: 10 };
                if (R === 5) { ws[cell_ref].s.font.bold = true; ws[cell_ref].s.fill = { fgColor: { rgb: "EEEEEE" } }; }
                if (R > 5 && C >= 6 && C <= 15) { ws[cell_ref].z = "#,##0.00"; ws[cell_ref].t = 'n'; }
            }
        }
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Report");
        XLSX.writeFile(wb, filename);
    }

    function exportAllErrorReport() {
        if (!currentChecker || currentChecker === "") { alert('โปรดเลือกชื่อผู้ตรวจสอบระบบก่อนการ Export รายงาน'); return; }
        if (combinedSalesData.length === 0) { alert('ไม่พบข้อมูลที่จะ Export กรุณานำเข้าไฟล์ก่อน'); return; }
        const filename = `SmartCheck_Export_${new Date().toISOString().slice(0, 10)}.xlsx`;
        exportToExcel(combinedSalesData, filename);
    }
    
    exportButtonAllError.addEventListener('click', exportAllErrorReport);
    const dashboardExportBtn = document.getElementById('btnExportDashboard');
    if (dashboardExportBtn) { dashboardExportBtn.addEventListener('click', exportAllErrorReport); }

    const uploadModalEl = document.getElementById('uploadModal');
    if (uploadModalEl) {
        uploadModalEl.addEventListener('show.bs.modal', function () {
            const fileInputs = [document.getElementById('fileSalesCash'), document.getElementById('fileSalesCredit'), document.getElementById('fileRefPrice')];
            fileInputs.forEach(input => input.value = '');
            const statusDiv = document.getElementById('uploadStatus');
            statusDiv.classList.add('alert-warning');
            statusDiv.classList.remove('d-none', 'alert-danger', 'alert-success');
            statusDiv.innerHTML = `<i class="bi bi-info-circle-fill me-2"></i> กรุณาเลือกไฟล์นำเข้าอย่างน้อย 1 ไฟล์`;
        });
        
        document.getElementById('btnProcessFiles').addEventListener('click', async function () { 
            const fileSalesCash = document.getElementById('fileSalesCash').files[0];
            const fileSalesCredit = document.getElementById('fileSalesCredit').files[0];
            const fileRefPrice = document.getElementById('fileRefPrice').files[0];
            const filesUploadedCount = (fileSalesCash ? 1 : 0) + (fileSalesCredit ? 1 : 0) + (fileRefPrice ? 1 : 0);
            const statusDiv = document.getElementById('uploadStatus');
            if (filesUploadedCount > 0) {
                statusDiv.classList.remove('alert-warning', 'alert-danger');
                statusDiv.classList.add('alert-info');
                statusDiv.innerHTML = `<i class="bi bi-clock-fill me-2"></i> กำลังประมวลผล ${filesUploadedCount} ไฟล์...`;
                try {
                    const [cashData, creditData] = await Promise.all([ readExcelFile(fileSalesCash, 'ขายสด'), readExcelFile(fileSalesCredit, 'ขายเชื่อ') ]);
                    const refData = await readExcelFile(fileRefPrice, 'ref_price');
                    let newCombinedData = [...cashData, ...creditData];
                    
                    // แก้ไข Logic การเรียงลำดับ: วันที่ -> เลขที่ -> ชื่อสินค้า
                    newCombinedData.sort((a, b) => {
                        // 1. เรียงตามวันที่ (Date)
                        if (a.doc_date !== b.doc_date) {
                            return a.doc_date > b.doc_date ? 1 : -1;
                        }
                        // 2. ถ้าวันที่เท่ากัน ให้เรียงตามเลขที่เอกสาร (Doc No)
                        if (a.doc_no !== b.doc_no) {
                            return a.doc_no > b.doc_no ? 1 : -1;
                        }
                        // 3. ถ้าเลขที่เท่ากัน ให้เรียงตามชื่อสินค้า (Product Name) ภาษาไทย
                        const nameA = a.prod_name || '';
                        const nameB = b.prod_name || '';
                        return nameA.localeCompare(nameB, 'th');
                    });

                    combinedSalesData = newCombinedData; 
                    referencePriceData = refData;
                    const totalRecords = combinedSalesData.length + referencePriceData.length;
                    statusDiv.classList.remove('alert-info');
                    statusDiv.classList.add('alert-success');
                    statusDiv.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> นำเข้าข้อมูลสำเร็จ! พบ ${totalRecords} รายการ`;
                    setTimeout(() => {
                        const modalInstance = bootstrap.Modal.getInstance(uploadModalEl);
                        modalInstance.hide();
                        renderReportTable('total-value-pane');
                        renderRefPriceTable(); 
                    }, 500);
                } catch (error) {
                    statusDiv.classList.remove('alert-info');
                    statusDiv.classList.add('alert-danger');
                    statusDiv.innerHTML = `<i class="bi bi-x-circle-fill me-2"></i> Error: ${error}`;
                }
            } else {
                statusDiv.classList.remove('alert-warning');
                statusDiv.classList.add('alert-danger');
                statusDiv.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i> กรุณาเลือกไฟล์นำเข้าอย่างน้อย 1 ไฟล์`;
            }
        });
    }

    const errorCheckTabs = document.querySelectorAll('#errorCheckTabs .nav-link');
    errorCheckTabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function (e) {
            const targetLink = e.target.getAttribute('data-bs-target');
            const paneId = targetLink.replace('#', '');
            if(paneId === 'ref-price-pane') {
                renderRefPriceTable();
            } else {
                renderReportTable(paneId);
            }
        });
    });

    loadCheckerNames(); 
    loadAgentNames(); 
    setupGlobalSearch(); 

    document.querySelector('[data-bs-target="#content-welcome"]').classList.add('active');
    const dailyTabLink = document.getElementById('daily-tab');
    if (dailyTabLink) {
        const bsTab = new bootstrap.Tab(dailyTabLink);
        bsTab.show();
    }
});