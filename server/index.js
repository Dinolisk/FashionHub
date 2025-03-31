// Fil: server/index.js

const express = require('express');
const cors = require('cors');
const fs = require('fs').promises; // Använder promise-baserad fs
const path = require('path');
const bcrypt = require('bcrypt'); // För säker lösenordshantering

const app = express();
const PORT = 5001; // Definiera porten här uppe

// Middleware
app.use(cors()); // Tillåt anrop från andra domäner/portar (din React-app)
app.use(express.json()); // Tolka JSON-data i request body

// Konstanter för filvägar och bcrypt
const ORDERS_FILE = path.join(__dirname, 'orders.json');
const USERS_FILE = path.join(__dirname, 'users.json');
const saltRounds = 10; // Antal saltningsrundor för bcrypt

// Funktion för att skapa datafiler om de inte finns
const initializeFiles = async () => {
  try {
    // Kolla/skapa orders.json
    try {
      await fs.access(ORDERS_FILE);
    } catch {
      await fs.writeFile(ORDERS_FILE, JSON.stringify([], null, 2));
      console.log('Created orders.json');
    }
    // Kolla/skapa users.json
    try {
      await fs.access(USERS_FILE);
    } catch {
      await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2));
      console.log('Created users.json');
    }
  } catch (error) {
    console.error("Error initializing data files:", error);
    // Stoppa servern om vi inte kan initiera filerna? Eller hantera på annat sätt.
    process.exit(1); // Avsluta om filerna inte kan skapas
  }
};

// --- API Endpoints ---

// Spara en beställning (din ursprungliga kod)
app.post('/api/orders', async (req, res) => {
  try {
    const order = req.body;
    let orders = [];

    // Läs befintliga ordrar, hantera om filen är tom eller ej existerar initialt
    try {
      const data = await fs.readFile(ORDERS_FILE, 'utf8'); // Ange encoding
      orders = JSON.parse(data);
    } catch (readError) {
        // Om filen är tom eller inte är giltig JSON initialt, starta med tom array
        if (readError.code !== 'ENOENT') { // Ignorera om filen inte finns (bör ha skapats av init)
             console.warn("Could not parse orders.json, starting fresh.", readError.message);
        }
    }

    // Lägg till ny order med ID och datum
    orders.push({ id: Date.now(), ...order, date: new Date() }); // Använd Date.now() för enklare unikt ID

    // Skriv tillbaka till filen
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));

    res.status(201).json({ message: 'Beställning sparad', orderId: orders[orders.length-1].id }); // Skicka tillbaka ID
  } catch (error) {
    console.error("Order save error:", error);
    res.status(500).json({ error: 'Kunde inte spara beställning' });
  }
});

// Registrera en ny användare
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validering
    if (!email || !password) {
      return res.status(400).json({ error: 'E-post och lösenord krävs' });
    }
    // Lägg gärna till mer validering här (t.ex. e-postformat, lösenordslängd)

    // Läs befintliga användare
    let users = [];
     try {
        const data = await fs.readFile(USERS_FILE, 'utf8');
        users = JSON.parse(data);
     } catch (readError) {
        if (readError.code !== 'ENOENT') {
             console.warn("Could not parse users.json, starting fresh.", readError.message);
        }
     }

    // Kolla om användaren redan finns
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'E-postadressen är redan registrerad' }); // 409 Conflict
    }

    // Hasha lösenordet
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Skapa ny användare
    const newUser = {
      id: Date.now(), // Enkelt unikt ID
      email: email,
      password: hashedPassword // Spara det hashade lösenordet
    };

    // Lägg till och spara
    users.push(newUser);
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));

    // Skicka tillbaka ett positivt svar (skicka INTE tillbaka lösenordet)
    res.status(201).json({ message: 'Användare registrerad', userId: newUser.id });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: 'Kunde inte registrera användare' });
  }
});

// Logga in en användare
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-post och lösenord krävs' });
    }

    // Läs användare
    let users = [];
    try {
        const data = await fs.readFile(USERS_FILE, 'utf8');
        users = JSON.parse(data);
    } catch (readError) {
        // Om filen är tom eller korrupt vid inloggningsförsök
        console.error("Could not read users file for login:", readError);
        return res.status(500).json({ error: 'Internt serverfel vid inloggning (kunde inte läsa användardata)' });
    }


    // Hitta användaren
    const user = users.find(user => user.email === email);
    if (!user) {
      // Skicka samma meddelande oavsett om e-post eller lösenord är fel för säkerhetsskäl
      return res.status(401).json({ error: 'Ogiltig e-post eller lösenord' }); // 401 Unauthorized
    }

    // Jämför det inskickade lösenordet med det lagrade hashade lösenordet
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      // Lösenorden matchar!
      // I en riktig app: skapa en JWT (JSON Web Token) här och skicka tillbaka den.
      // För denna övning: skicka tillbaka användarinfo (UTAN lösenord).
      res.status(200).json({
        message: 'Inloggning lyckades',
        user: {
          id: user.id,
          email: user.email
          // Skicka ALDRIG tillbaka user.password!
        }
        // token: genereradToken // Om du implementerar JWT
      });
    } else {
      // Lösenorden matchar inte
      return res.status(401).json({ error: 'Ogiltig e-post eller lösenord' });
    }

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: 'Kunde inte logga in användare' });
  }
});


// --- Starta servern ---
// Kör initializeFiles först, och starta sedan servern när det är klart
initializeFiles().then(() => {
  app.listen(PORT, () => {
    console.log(`Server kör på http://localhost:${PORT}`);
    console.log(`Tillgängliga endpoints:`);
    console.log(`  POST /api/orders`);
    console.log(`  POST /api/register`);
    console.log(`  POST /api/login`);
  });
}).catch(error => {
    console.error("Failed to initialize and start server:", error);
});