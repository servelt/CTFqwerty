const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'ctf_db'
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use(cookieParser());

function parseStorage(storageStr) {
    if (!storageStr) return 0;
    const value = parseFloat(storageStr);
    const unit = storageStr.toUpperCase().replace(/[0-9.]/g, '');

    if (unit === 'GB') {
        return value * 1024; // GB를 MB로 변환
    } else if (unit === 'MB') {
        return value;
    }
    return 0; // 알 수 없는 단위
}
function getMaxStorage(plan) {
    switch (plan) {
        case 'Basic':
            return 1 * 1024; // 1GB
        case 'Platinum':
            return 100 * 1024; // 100GB
        case 'Premiere':
            return 999999 * 1024; // 무제한
        default:
            return 0;
    }
}


// Express-session 미들웨어는 모든 라우트보다 위에 위치해야 합니다.
app.use(session({
    secret: 'your_super_secret_key_for_ctf',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'static'));

let receivedFlags = {};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'main.html'));
});

app.get('/cookie', (req, res) => {
    const auth = req.cookies.id;
    if (auth === 'qwerty') {
        res.sendFile(path.join(__dirname, 'static', 'cookiebasic.html'));
    } else if (auth === 'sunrin') {
        res.sendFile(path.join(__dirname, 'static', 'cookievip.html'));
    } else {
        res.sendFile(path.join(__dirname, 'static', 'cookienolog.html'));
    }
});

app.get('/profile', (req, res) => {
    const auth = req.cookies.id;
    const user = auth === 'hg0g89aksd3hlanx' ? { auth: auth, name: 'qwerty' } : null;
    res.render('profile', { user });
});

// SQL 페이지 라우트를 수정했습니다.
// 이제 세션에 저장된 사용자 정보(req.session.user)를 EJS 템플릿으로 전달합니다.
app.get('/sql', (req, res) => {
    const user = req.session.user || null;
    console.log('Rendering /sql for user:', user);
    res.render('sql', { user });
});

app.get('/cookieflag', (req, res) => {
    let flag = req.query.cookie;
    if (flag === "qwerty{yΟu_cΑn_forgry_cΟΟkie!↑!}") {
        res.send(`<script>alert("올바른 플래그입니다! 축하합니다!"); window.location.href = "/";</script>`);
    } else {
        res.send(`<script>alert("아쉽지만 틀린 플래그입니다"); window.location.href = "/";</script>`);
    }
});

app.get('/profileflag', (req, res) => {
    let flag = req.query.profile;
    console.log(flag);
    if (flag === "qwerty{how_d1d_y0u_0pen_admln_pr0f1Ie}") {
        res.send(`<script>alert("올바른 플래그입니다! 축하합니다!"); window.location.href = "/";</script>`);
    } else {
        res.send(`<script>alert("아쉽지만 틀린 플래그입니다"); window.location.href = "/";</script>`);
    }
});

app.get('/sqlflag', (req, res) => {
    let flag = req.query.sql;
    if (flag === "qwerty{i_was_being_broken_while_making_it}") {
        res.send(`<script>alert("올바른 플래그입니다! 축하합니다!"); window.location.href = "/";</script>`);
    } else {
        res.send(`<script>alert("아쉽지만 틀린 플래그입니다"); window.location.href = "/";</script>`);
    }
});

app.get('/cookie/login', (req, res) => {
    if (req.cookies.auth) {
        res.send('<script>alert("이미 로그인된 상태입니다!"); window.location.href = "/";</script>');
    } else {
        res.sendFile(path.join(__dirname, 'static', 'cookielogin.html'));
    }
});

app.post('/cookie/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'qwerty' && password === 'qwerty') {
        res.cookie('id', 'qwerty', { httpOnly: true });
        res.redirect('/cookie');
    } else {
        res.send('<script>alert("로그인 실패!"); window.location.href = "/cookie/login";</script>');
    }
});

app.get('/cookie/iolog', (req, res) => {
    const auth = req.cookies.id;
    if (auth === 'qwerty') {
        res.sendFile(path.join(__dirname, 'static', 'iologbasic.html'));
    } else if (auth === 'sunrin') {
        res.sendFile(path.join(__dirname, 'static', 'iologvip.html'));
    } else {
        res.send('<script>alert("권한이 부족합니다!"); window.location.href = "/cookie";</script>');
    }
});

app.get('/cookie/card', (req, res) => {
    const auth = req.cookies.id;
    if (auth === 'qwerty') {
        res.sendFile(path.join(__dirname, 'static', 'cardbasic.html'));
    } else if (auth === 'sunrin') {
        res.sendFile(path.join(__dirname, 'static', 'cardvip.html'));
    } else {
        res.send('<script>alert("권한이 부족합니다!"); window.location.href = "/cookie";</script>');
    }
});

app.get('/cookie/vip', (req, res) => {
    const auth = req.cookies.id;
    if (auth === 'sunrin') {
        res.sendFile(path.join(__dirname, 'static', 'vip.html'));
    } else {
        res.send('<script>alert("권한이 부족합니다!"); window.location.href = "/cookie";</script>');
    }
});

app.get('/cookie/logout', (req, res) => {
    res.clearCookie('id');
    res.redirect('/cookie');
});

app.get('/profile/sec', (req, res) => {
    const auth = req.cookies.id;
    const user = auth === 'hg0g89aksd3hlanx' ? { auth: auth, name: 'qwerty' } : null;
    res.render('sec', { user });
});

app.get('/profile/soft', (req, res) => {
    const auth = req.cookies.id;
    const user = auth === 'hg0g89aksd3hlanx' ? { auth: auth, name: 'qwerty' } : null;
    res.render('soft', { user });
});

app.get('/profile/it', (req, res) => {
    const auth = req.cookies.id;
    const user = auth === 'hg0g89aksd3hlanx' ? { auth: auth, name: 'qwerty' } : null;
    res.render('it', { user });
});

app.get('/profile/design', (req, res) => {
    const auth = req.cookies.id;
    const user = auth === 'hg0g89aksd3hlanx' ? { auth: auth, name: 'qwerty' } : null;
    res.render('design', { user });
});

app.get('/profile/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'profilelogin.html'));
});

app.post('/profile/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'qwerty' && password === 'qwerty') {
        res.cookie('id', 'hg0g89aksd3hlanx', { httpOnly: true });
        res.redirect('/profile');
    } else {
        res.send('<script>alert("로그인 실패!"); window.location.href = "/profile/login";</script>');
    }
});

app.get('/profile/logout', (req, res) => {
    res.clearCookie('id');
    res.redirect('/profile');
});

app.get('/profile/id', (req, res) => {
    const auth = req.cookies.id;
    const user = req.query.id;
    if (auth === 'hg0g89aksd3hlanx') {
        if (user === 'qwerty') {
            res.sendFile(path.join(__dirname, 'static', 'profileqwerty.html'));
        } else if (user === 'admin') {
            res.sendFile(path.join(__dirname, 'static', 'profileadmin.html'));
        } else {
            res.send('<script>alert("존재하지 않는 아이디입니다"); window.location.href = "/profile";</script>');
        }
    } else {
        res.send('<script>alert("로그인이 필요합니다"); window.location.href = "/profile";</script>');
    }
});

app.get('/sql/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'sqllogin.html'));
});

// SQL 로그인 POST 라우트를 수정했습니다.
app.post('/sql/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Received login attempt:', { username, password });
    
    // SQL 쿼리를 수정하여 'subscription_plan'과 'data_usage' 컬럼을 추가로 가져옵니다.
    const query = `SELECT id, username, subscription_plan, data_usage FROM users WHERE username = '${username}' AND password = '${password}'`;
    
    console.log('Executing query:', query);

    try {
        const [rows] = await pool.execute(query);
        
        if (rows.length > 0) {
            // 로그인 성공 시 세션에 사용자 정보와 플랜, 용량 정보를 함께 저장합니다.
            // 딕셔너리 접근 이름은 요청하신 대로 plan과 storage로 설정합니다.
            req.session.user = { 
                id: rows[0].id, 
                name: rows[0].username,
                plan: rows[0].subscription_plan,
                storage: rows[0].data_usage
            };
            console.log('Login successful for user:', req.session.user);
            
            // 로그인 성공 시 /sql 페이지로 리디렉션
            res.redirect('/sql');

        } else {
            res.send(`
                <script>
                alert('로그인 실패: 사용자 이름 또는 비밀번호가 올바르지 않습니다.');
                window.location.href = '/sql/login';
                </script>
            `);
        }
    } catch (error) {
        console.error("SQL 쿼리 실행 오류:", error);
        res.status(500).send("서버에서 오류가 발생했습니다.");
    }
});

app.get('/sql/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/sql');
});

app.get('/sql/plan', (req, res) => {
    const user = req.session.user;
    if (user) {
        res.render('plan', { user });
    } else {
        res.send('<script>alert("로그인이 필요합니다"); window.location.href = "/sql";</script>');
    }
});

app.get('/sql/storage', (req, res) => {
    const user = req.session.user;
    if (user) {
        // DB에서 가져온 사용량 문자열을 MB로 변환
        const usedStorageMB = parseStorage(user.storage);
        // 플랜에 맞는 총 용량(MB) 계산
        const maxStorageMB = getMaxStorage(user.plan);
        
        // 남은 용량 계산 (MB 단위)
        const remainingStorageMB = maxStorageMB - usedStorageMB;
        
        // EJS 템플릿으로 데이터 전달
        res.render('storage', { 
            user: user,
            usedStorage: user.storage, // DB 원본 문자열 전달
            remainingStorage: (remainingStorageMB > 0 ? (remainingStorageMB / 1024).toFixed(2) : 0) + ' GB', // GB로 변환하여 전달
        });
    } else {
        res.send('<script>alert("로그인이 필요합니다"); window.location.href = "/sql";</script>');
    }
});
app.get('/sql/logs', async (req, res) => {
    const user = req.session.user;
    if (!user || (user.id !== 1 && user.name !== 'admin')) {
        return res.send('<script>alert("관리자만 접근할 수 있습니다."); window.location.href = "/sql";</script>');
    }

    const requestedFile = req.query.log;
    if (!requestedFile) {
        return res.status(400).send('<script>alert("로그 파일명을 지정해야 합니다."); window.location.href = "/sql";</script>');
    }

    const baseLogPath = path.join(__dirname, 'static', 'log');
    const logFilePath = path.join(baseLogPath, requestedFile);
    
    try {
        // readFile로 전체 내용을 한 번에 읽어옵니다.
        const logContent = await fs.readFile(logFilePath, 'utf8');

        // `logs` 변수에 전체 문자열을 그대로 담아 EJS로 전달합니다.
        res.render('sqllog', {
            user: user,
            logs: logContent 
        });
    } catch (error) {
        console.error('로그 파일 읽기 오류:', error);
        res.status(500).send('파일을 불러오는 중 오류가 발생했습니다.');
    }
});

app.get('/sql/users', async (req, res) => {
    // 1. 관리자 권한 확인
    const user = req.session.user;
    if (!user || (user.id !== 1 && user.username !== 'admin')) {
        return res.send('<script>alert("관리자만 접근할 수 있습니다."); window.location.href = "/sql";</script>');
    }
    
    // 2. DB에서 모든 사용자 정보 조회
    try {
        console.log('Fetching users from database...');
        const query = 'SELECT * FROM users';
        const [users] = await pool.execute(query);
        console.log('Fetched users:', users);
        console.log('array: ',Array.isArray(users));  // true여야 합니다.
        console.log('render: ',users[0]);
        // 3. 템플릿 렌더링 시 users 변수 전달
        res.render('sqlusers', { 
            user: user,
            users: users 
        });
    } catch (error) {
        console.error('사용자 조회 오류:', error);
        res.status(500).send('서버 오류');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});