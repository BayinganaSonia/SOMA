const http = require('http');

async function testStudentRegister() {
  console.log('🧑‍🎓 Testing STUDENT registration...');
  const postData = JSON.stringify({
    full_name: 'Test Student',
    username: 'teststudent' + Date.now(),
    password: 'Password123',
    confirmPassword: 'Password123',
    role: 'student',
    termsAccepted: true
  });

  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log('Student response:', res.statusCode, json);
          resolve({status: res.statusCode, data: json});
        } catch (e) {
          console.log('Student parse error:', data);
          resolve({status: res.statusCode, data});
        }
      });
    });

    req.on('error', (e) => {
      console.error('Student request error:', e);
      resolve({error: e.message});
    });

    req.write(postData);
    req.end();
  });
}

async function testTeacherRegister() {
  console.log('👩‍🏫 Testing TEACHER registration...');
  const postData = JSON.stringify({
    full_name: 'Test Teacher',
    email: 'teacher@example.com',
    username: 'testteacher' + Date.now(),
    password: 'Password123',
    confirmPassword: 'Password123',
    role: 'teacher',
    termsAccepted: true
  });

  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log('Teacher response:', res.statusCode, json);
          resolve({status: res.statusCode, data: json});
        } catch (e) {
          console.log('Teacher parse error:', data);
          resolve({status: res.statusCode, data});
        }
      });
    });

    req.on('error', (e) => {
      console.error('Teacher request error:', e);
      resolve({error: e.message});
    });

    req.write(postData);
    req.end();
  });
}

testStudentRegister().then(testTeacherRegister);
