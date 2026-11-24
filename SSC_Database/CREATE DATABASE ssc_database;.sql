CREATE DATABASE ssc_database;
GO

USE ssc_database;
GO

-- Tạo bảng Quản lý Mẫu mã (Product_Template)
CREATE TABLE Product_Template (
    Template_ID INT IDENTITY(1,1) PRIMARY KEY,
    Template_Name NVARCHAR(255) NOT NULL,
    Category NVARCHAR(100) NOT NULL,
    Base_Specs NVARCHAR(MAX), -- Thông số kỹ thuật dạng JSON
    Created_At DATETIME DEFAULT GETDATE()
);
GO

-- Tạo bảng Quản lý Nguồn cung C2M (Supplier_SKU)
CREATE TABLE Supplier_SKU (
    SKU_ID INT IDENTITY(1,1) PRIMARY KEY,
    Template_ID INT NOT NULL FOREIGN KEY REFERENCES Product_Template(Template_ID),
    Supplier_Name NVARCHAR(255) NOT NULL, 
    Base_Cost DECIMAL(18,2) NOT NULL,     
    Available_Stock INT DEFAULT 0,        
    In_Production_Stock INT DEFAULT 0,    
    Lead_Time_Days INT DEFAULT 0,         
    Last_Updated DATETIME DEFAULT GETDATE()
);
GO

-- Nạp Mock Data: Sản phẩm ngách Desk Setup
INSERT INTO Product_Template (Template_Name, Category, Base_Specs)
VALUES
(N'Bàn phím cơ không dây 75%', N'Desk Setup', N'{"Switch": "Linear", "Keycap": "PBT", "Connect": "Bluetooth/2.4G"}'),
(N'Chuột công thái học Ergonomic', N'Tech Accessories', N'{"DPI": "4000", "Battery": "Type-C 500mAh"}'),
(N'Giá đỡ màn hình Arm Hợp kim nhôm', N'Desk Setup', N'{"LoadCapacity": "9kg", "Vesa": "75x75/100x100"}');
GO

-- Nạp Mock Data: Dữ liệu đa xưởng sản xuất (C2M)
INSERT INTO Supplier_SKU (Template_ID, Supplier_Name, Base_Cost, Available_Stock, In_Production_Stock, Lead_Time_Days)
VALUES
(1, N'Xưởng Cơ khí Điện tử Thâm Quyến', 450000, 150, 300, 5),
(1, N'Nhà máy Nhựa công nghệ Đông Quản', 420000, 50, 500, 7),
(2, N'Xưởng Thiết bị ngoại vi Quảng Châu', 120000, 500, 1000, 3),
(3, N'Nhà máy Kim loại CNC Chiết Giang', 280000, 200, 0, 10);
GO