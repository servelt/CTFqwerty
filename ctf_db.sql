
CREATE DATABASE IF NOT EXISTS ctf_db;
USE ctf_db;


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    subscription_plan VARCHAR(20) NOT NULL DEFAULT 'basic',
    data_usage VARCHAR(20) NOT NULL DEFAULT '0MB'
);

INSERT INTO users (username, password, subscription_plan, data_usage) VALUES
('admin', 'f092jh;a0fuhj34n2lqo987gfbasu73', 'admin', 'unlimited'),
('qwerty', 'qwerty', 'Platinum', '50GB'),
('user_001', 'P@ssw0rd!1', 'Premiere', '532GB'),
('user_002', 'myP@ss!123', 'Basic', '891MB'),
('john_doe_03', 'J0hn!Doe03', 'Basic', '456MB'),
('mike_smith_04', 'M1k3!S#mith', 'Platinum', '15GB'),
('user_005', 'password2025!', 'Basic', '345MB'),
('lily_06', 'L1lY*P@ss', 'Basic', '678MB'),
('anna_kim_07', 'An@12345!', 'Platinum', '22GB'),
('jane_doe_08', 'J@neDoE1!', 'Basic', '123MB'),
('tony_stark_09', 'T0nY!St@rk', 'Basic', '789MB'),
('lucas_10', 'LuC@5!10', 'Platinum', '38GB'),
('sarah_11', 'S4r@h_@11', 'Basic', '543MB'),
('david_12', 'Dav1D_123', 'Basic', '210MB'),
('emily_13', 'Em!ly@13', 'Basic', '981MB'),
('alice_14', 'A!l1cE@14', 'Basic', '405MB'),
('benjamin_15', 'B3nJ@min!15', 'Platinum', '45GB'),
('eva_16', 'Ev@_Pa$$16', 'Basic', '765MB'),
('kevin_17', 'K3V!n#17', 'Premiere', '1032GB'),
('sophia_18', '$0ph!@_18', 'Basic', '876MB'),
('oscar_19', 'O$C@r!19', 'Platinum', '21GB'),
('charlotte_20', 'Ct4_h@rl0tte#20', 'Basic', '321MB'),
('victor_21', 'V!ct0r_21', 'Basic', '654MB'),
('mark_22', 'M@rk!22#$', 'Basic', '190MB'),
('claire_23', 'C!@ir3_23', 'Platinum', '33GB'),
('lucy_24', 'L!ucy!@24', 'Basic', '555MB'),
('henry_25', 'H3nry_25!', 'Basic', '800MB'),
('jason_26', 'J@son*26', 'Basic', '240MB'),
('maria_27', 'M@r!@_27', 'Platinum', '41GB'),
('paul_28', 'P@ul_!28', 'Basic', '720MB'),
('lily_moon_29', 'L1lY_M00n@29', 'Basic', '480MB'),
('alex_30', '@lex_30P@ss', 'Basic', '910MB');
