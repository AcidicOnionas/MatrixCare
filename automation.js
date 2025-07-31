const { chromium } = require('playwright');
const readline = require('readline');

class InteractiveAutomation {
  constructor() {
    this.browser = null;
    this.page = null;
    this.rl = null;
  }

  async initialize() {
    if (!this.browser) {
      console.log('🚀 Starting browser...');
      this.browser = await chromium.launch({
        headless: false,
        slowMo: 250 // Slow down actions for visibility
      });

      const context = await this.browser.newContext({
        recordVideo: {
          dir: 'videos/',
          size: { width: 1280, height: 720 }
        }
      });
      this.page = await context.newPage();

      // Navigate to your MatrixCare app
      await this.page.goto('http://localhost:3000');
      console.log('✅ Browser ready!');
    }
  }

  showHelp() {
    console.log('\n📋 Available commands:');
    console.log("- 'click [text]' - Click element with text");
    console.log("- 'click_role [role] [name]' - Click element by role and name");
    console.log("- 'fill [selector] [text]' - Fill text into element");
    console.log("- 'select [selector] [value]' - Select option from dropdown");
    console.log("- 'type [selector] [text]' - Type text into element");
    console.log("- 'goto [url]' - Navigate to URL");
    console.log("- 'screenshot [filename]' - Take screenshot");
    console.log("- 'wait [seconds]' - Wait for specified seconds");
    console.log("- 'login [email] [password]' - Quick login");
    console.log("- 'logout' - Quick logout");
    console.log("- 'add_patient [firstName] [lastName] [age] [sex] [room] [physician] [dob]' - Quick add patient");
    console.log("- 'save_patient' - Click Save Patient button in modal");
    console.log("- 'save_vitals' - Click Save Entry button in vital signs");
    console.log("- 'add_vitals [patientId] [bp] [hr] [temp] [tempUnit] [resp] [o2sat]' - Add vital signs");
    console.log("- 'patient_fields' - Show all patient form field names");
    console.log("- 'vital_fields' - Show all vital signs field names");
    console.log("- 'refresh' - Refresh the current page");
    console.log("- 'quit' or 'exit' - Close browser");
    console.log("- 'help' - Show this help");
  }

  async executeCommand(command) {
    const lowerCommand = command.toLowerCase().trim();

    try {
      if (lowerCommand === 'help') {
        this.showHelp();
      } else if (lowerCommand.startsWith('click ')) {
        const text = command.slice(6); // Remove 'click ' prefix
        await this.clickByText(text);
      } else if (lowerCommand.startsWith('click_role ')) {
        const parts = command.split(' ');
        if (parts.length >= 3) {
          const role = parts[1];
          const name = parts.slice(2).join(' ');
          await this.clickByRole(role, name);
        } else {
          console.log("Usage: click_role [role] [name]");
        }
      } else if (lowerCommand.startsWith('fill ') || lowerCommand.startsWith('type ')) {
        const parts = command.split(' ');
        if (parts.length >= 3) {
          const selector = parts[1];
          const text = parts.slice(2).join(' ');
          await this.fillField(selector, text);
        } else {
          console.log("Usage: fill [selector] [text]");
        }
      } else if (lowerCommand.startsWith('select ')) {
        const parts = command.split(' ');
        if (parts.length >= 3) {
          const selector = parts[1];
          const value = parts.slice(2).join(' ');
          await this.selectOption(selector, value);
        } else {
          console.log("Usage: select [selector] [value]");
        }
      } else if (lowerCommand.startsWith('goto ')) {
        const url = command.slice(5); // Remove 'goto ' prefix
        await this.navigate(url);
      } else if (lowerCommand.startsWith('screenshot ')) {
        const filename = command.slice(11) || `screenshot-${Date.now()}.png`;
        await this.takeScreenshot(filename);
      } else if (lowerCommand.startsWith('wait ')) {
        const seconds = parseFloat(command.slice(5));
        if (!isNaN(seconds)) {
          await this.wait(seconds);
        } else {
          console.log("Usage: wait [seconds]");
        }
      } else if (lowerCommand.startsWith('login ')) {
        const parts = command.split(' ');
        if (parts.length >= 3) {
          const email = parts[1];
          const password = parts[2];
          await this.quickLogin(email, password);
        } else {
          console.log("Usage: login [email] [password]");
        }
      } else if (lowerCommand === 'logout') {
        await this.quickLogout();
      } else if (lowerCommand.startsWith('add_patient ')) {
        const parts = command.split(' ');
        if (parts.length >= 3) {
          const firstName = parts[1];
          const lastName = parts[2];
          const age = parts[3] || '30';
          const sex = parts[4] || 'M';
          const room = parts[5] || '101';
          const physician = parts[6] || 'Dr. Smith';
          const dob = parts[7] || null; // Optional DOB parameter
          await this.quickAddPatient(firstName, lastName, age, sex, room, physician, dob);
        } else {
          console.log("Usage: add_patient [firstName] [lastName] [age] [sex] [room] [physician] [dob]");
          console.log("Example: add_patient John Doe 45 M 101 'Dr. Smith' 1979-05-15");
          console.log("Note: If dob not provided, it will be calculated from age");
        }
      } else if (lowerCommand.startsWith('add_vitals ')) {
        const parts = command.split(' ');
        if (parts.length >= 2) {
          const patientId = parts[1] || '1';
          const bp = parts[2] || '120/80';
          const hr = parts[3] || '72';
          const temp = parts[4] || '98.6';
          const tempUnit = parts[5] || 'F';
          const resp = parts[6] || '16';
          const o2sat = parts[7] || '98';
          await this.addVitalSigns(patientId, bp, hr, temp, tempUnit, resp, o2sat);
        } else {
          console.log("Usage: add_vitals [patientId] [bp] [hr] [temp] [tempUnit] [resp] [o2sat]");
          console.log("Example: add_vitals 1 120/80 72 98.6 F 16 98");
        }
      } else if (lowerCommand === 'patient_fields') {
        this.showPatientFields();
      } else if (lowerCommand === 'vital_fields') {
        this.showVitalFields();
      } else if (lowerCommand === 'save_patient') {
        await this.savePatient();
      } else if (lowerCommand === 'save_vitals') {
        await this.saveVitals();
      } else if (lowerCommand === 'refresh') {
        await this.refreshPage();
      } else {
        console.log("❓ Unknown command. Type 'help' for available commands.");
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }

  async clickByText(text) {
    try {
      // Try multiple strategies to find the element
      const strategies = [
        () => this.page.getByText(text, { exact: false }).first(),
        () => this.page.getByText(text, { exact: true }).first(),
        () => this.page.locator(`text=${text}`).first(),
        () => this.page.locator(`"${text}"`).first()
      ];

      for (const strategy of strategies) {
        try {
          const element = strategy();
          if (await element.count() > 0) {
            await element.click();
            console.log(`✅ Clicked element with text: ${text}`);
            return;
          }
        } catch (e) {
          // Continue to next strategy
        }
      }
      throw new Error(`Could not find element with text: ${text}`);
    } catch (error) {
      console.log(`❌ Error clicking '${text}': ${error.message}`);
    }
  }

  async clickByRole(role, name) {
    try {
      await this.page.getByRole(role, { name: name }).click();
      console.log(`✅ Clicked ${role} with name: ${name}`);
    } catch (error) {
      console.log(`❌ Error clicking ${role} '${name}': ${error.message}`);
    }
  }

  async fillField(selector, text) {
    try {
      // Special handling for vital signs fields
      const vitalSignsMap = {
        'bloodPressureSystolic': 'input[placeholder="120"]',
        'bloodPressureDiastolic': 'input[placeholder="80"]',
        'temperature': 'input[placeholder="98.6"]',
        'pulse': 'input[placeholder="72"]',
        'respiration': 'input[placeholder="16"]',
        'oxygenSaturation': 'input[placeholder="98"]',
        'painLevel': 'input[placeholder="0"]',
        'notes': 'textarea[placeholder*="Additional notes"]'
      };

      if (vitalSignsMap[selector]) {
        const element = this.page.locator(vitalSignsMap[selector]);
        await element.clear();
        await element.fill(text);
        console.log(`✅ Filled vital signs '${selector}' with '${text}'`);
        return;
      }

      // Try different strategies to find form fields
      const strategies = [
        () => this.page.getByLabel(selector),
        () => this.page.getByPlaceholder(selector),
        () => this.page.locator(`[name="${selector}"]`),
        () => this.page.locator(`[id="${selector}"]`),
        () => this.page.locator(selector)
      ];

      for (const strategy of strategies) {
        try {
          const element = strategy();
          if (await element.count() > 0) {
            await element.clear();
            await element.fill(text);
            console.log(`✅ Filled '${selector}' with '${text}'`);
            return;
          }
        } catch (e) {
          // Continue to next strategy
        }
      }
      throw new Error(`Could not find field: ${selector}`);
    } catch (error) {
      console.log(`❌ Error filling ${selector}: ${error.message}`);
    }
  }

  async selectOption(selector, value) {
    try {
      // Special handling for vital signs dropdowns
      if (selector === 'temperatureUnit') {
        // Find the temperature unit dropdown (it's next to the temperature input)
        const tempUnitSelect = this.page.locator('select').filter({ hasText: '°F' }).or(this.page.locator('select').filter({ hasText: '°C' }));
        if (await tempUnitSelect.count() > 0) {
          await tempUnitSelect.selectOption(value);
          console.log(`✅ Selected temperature unit '${value}'`);
          return;
        }
      }

      // Try different strategies to find dropdown
      const strategies = [
        () => this.page.getByLabel(selector),
        () => this.page.locator(`[name="${selector}"]`),
        () => this.page.locator(`[id="${selector}"]`),
        () => this.page.locator(`select[name="${selector}"]`),
        () => this.page.locator(selector)
      ];

      for (const strategy of strategies) {
        try {
          const element = strategy();
          if (await element.count() > 0) {
            // Wait for element to be ready
            await element.waitFor({ state: 'visible' });
            await element.selectOption(value);
            console.log(`✅ Selected '${value}' in '${selector}'`);
            return;
          }
        } catch (e) {
          // Continue to next strategy
        }
      }
      throw new Error(`Could not find dropdown: ${selector}`);
    } catch (error) {
      console.log(`❌ Error selecting option in ${selector}: ${error.message}`);
    }
  }

  async navigate(url) {
    try {
      const fullUrl = url.startsWith('http') ? url : `http://localhost:3000${url}`;
      await this.page.goto(fullUrl);
      console.log(`✅ Navigated to: ${fullUrl}`);
    } catch (error) {
      console.log(`❌ Error navigating to ${url}: ${error.message}`);
    }
  }

  async takeScreenshot(filename) {
    try {
      await this.page.screenshot({
        path: filename,
        fullPage: true
      });
      console.log(`✅ Screenshot saved as: ${filename}`);
    } catch (error) {
      console.log(`❌ Error taking screenshot: ${error.message}`);
    }
  }

  async wait(seconds) {
    try {
      await this.page.waitForTimeout(seconds * 1000);
      console.log(`✅ Waited ${seconds} seconds`);
    } catch (error) {
      console.log(`❌ Error waiting: ${error.message}`);
    }
  }

  async quickLogin(email, password) {
    try {
      console.log(`🔐 Attempting to login with ${email}...`);
      
      // Navigate to login if not already there
      if (!this.page.url().includes('/login')) {
        await this.page.goto('http://localhost:3000/login');
      }
      
      // Fill login form
      await this.page.fill('[name="email"]', email);
      await this.page.fill('[name="password"]', password);
      await this.page.click('button[type="submit"]');
      
      // Wait for navigation
      await this.page.waitForURL('**/dashboard', { timeout: 5000 });
      console.log(`✅ Successfully logged in as ${email}`);
    } catch (error) {
      console.log(`❌ Login failed: ${error.message}`);
    }
  }

  async quickLogout() {
    try {
      console.log(`🚪 Logging out...`);
      
      // Try to find and click the user menu/profile button first
      try {
        // Look for user menu button (could be an avatar, name, or dropdown)
        const userMenuSelectors = [
          '[data-testid="user-menu"]',
          '.user-menu',
          'button[aria-label*="user"]',
          'button[aria-label*="profile"]',
          'button[aria-label*="account"]'
        ];
        
        let userMenuFound = false;
        for (const selector of userMenuSelectors) {
          try {
            const element = this.page.locator(selector);
            if (await element.count() > 0) {
              await element.click();
              userMenuFound = true;
              break;
            }
          } catch (e) {
            // Continue to next selector
          }
        }
        
        // If no specific user menu found, try clicking on user-related text
        if (!userMenuFound) {
          const userTextOptions = ['Profile', 'Account', 'User', 'Menu'];
          for (const text of userTextOptions) {
            try {
              const element = this.page.getByText(text).first();
              if (await element.count() > 0) {
                await element.click();
                userMenuFound = true;
                break;
              }
            } catch (e) {
              // Continue to next option
            }
          }
        }
        
        // Wait a moment for dropdown to appear
        await this.page.waitForTimeout(500);
      } catch (e) {
        // Continue even if user menu click fails
      }
      
      // Now try to click logout
      const logoutSelectors = [
        'text=Logout',
        'text=Log out',
        'text=Sign out',
        'text=Sign Out',
        '[data-testid="logout"]',
        'button[aria-label*="logout"]',
        'button[aria-label*="sign out"]',
        'a[href*="logout"]'
      ];
      
      let logoutSuccess = false;
      for (const selector of logoutSelectors) {
        try {
          const element = this.page.locator(selector);
          if (await element.count() > 0) {
            await element.click();
            logoutSuccess = true;
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }
      
      if (logoutSuccess) {
        // Wait for navigation to login page
        await this.page.waitForURL('**/login', { timeout: 5000 });
        console.log(`✅ Successfully logged out`);
      } else {
        // Fallback: navigate directly to login page (simulates logout)
        await this.page.goto('http://localhost:3000/login');
        console.log(`✅ Navigated to login page (logout fallback)`);
      }
      
    } catch (error) {
      console.log(`❌ Logout failed: ${error.message}`);
      // Fallback: navigate to login page
      try {
        await this.page.goto('http://localhost:3000/login');
        console.log(`✅ Navigated to login page (fallback)`);
      } catch (fallbackError) {
        console.log(`❌ Fallback navigation failed: ${fallbackError.message}`);
      }
    }
  }

  async quickAddPatient(firstName, lastName, age = '30', sex = 'M', room = '101', physician = 'Dr. Smith', dobInput = null) {
    try {
      // Calculate or use provided date of birth
      let dob;
      if (dobInput) {
        dob = dobInput;
        console.log(`👤 Adding patient: ${firstName} ${lastName}, DOB: ${dob}, Sex: ${sex}, Room: ${room}, Physician: ${physician}...`);
      } else {
        const currentYear = new Date().getFullYear();
        const birthYear = currentYear - parseInt(age);
        dob = `${birthYear}-01-01`;
        console.log(`👤 Adding patient: ${firstName} ${lastName}, Age: ${age} (DOB: ${dob}), Sex: ${sex}, Room: ${room}, Physician: ${physician}...`);
      }
      
      // Click Add Patient button (be more specific to avoid multiple matches)
      await this.page.getByRole('button', { name: 'Add Patient' }).first().click();
      
      // Wait for modal to appear
      await this.page.waitForTimeout(1000);
      
      // Fill patient form (using the actual field names from your modal)
      await this.page.fill('[name="firstName"]', firstName);
      await this.page.fill('[name="lastName"]', lastName);
      
      // Fill date of birth (this is the correct field name)
      await this.page.fill('[name="dob"]', dob);
      
      // Fill age field if it exists
      try {
        await this.page.fill('[name="age"]', age.toString());
      } catch (e) {
        // Age field might not exist or be auto-calculated
      }
      
      // Fill sex field (now a text input)
      const sexValue = sex.toUpperCase() === 'M' ? 'M' : sex.toUpperCase() === 'F' ? 'F' : 'M';
      await this.page.fill('[name="sex"]', sexValue);
      
      // Fill room
      await this.page.fill('[name="room"]', room);
      
      // Fill physician
      await this.page.fill('[name="physician"]', physician);
      
      // Fill optional fields with defaults
      await this.page.fill('[name="allergies"]', 'None');
      await this.page.fill('[name="diagnoses"]', 'General Care');
      await this.page.fill('[name="diet"]', 'Regular');
      await this.page.fill('[name="adminInstructions"]', 'Standard care protocols');
      
      // Submit form (try multiple selectors for the submit button)
      try {
        await this.page.click('button[type="submit"]');
      } catch (e) {
        // Try alternative selectors
        const submitSelectors = [
          'text="Save Patient"',
          'text="Save Changes"',
          'button:has-text("Save Patient")',
          'button:has-text("Save Changes")',
          '.btn-primary',
          'form button[type="submit"]'
        ];
        
        let submitted = false;
        for (const selector of submitSelectors) {
          try {
            await this.page.click(selector);
            submitted = true;
            break;
          } catch (err) {
            // Continue to next selector
          }
        }
        
        if (!submitted) {
          throw new Error('Could not find submit button');
        }
      }
      
      // Wait for modal to close
      await this.page.waitForTimeout(2000);
      
      console.log(`✅ Successfully added patient: ${firstName} ${lastName}`);
    } catch (error) {
      console.log(`❌ Failed to add patient: ${error.message}`);
      console.log(`💡 Try using individual commands like:`);
      console.log(`   click Add Patient`);
      console.log(`   fill firstName ${firstName}`);
      console.log(`   fill lastName ${lastName}`);
      console.log(`   fill dob ${dob || '1990-01-01'}`);
      console.log(`   click Save Patient`);
    }
  }

  showPatientFields() {
    console.log('\n📋 Patient Form Field Names:');
    console.log('Basic Information:');
    console.log('  - firstName (First Name)');
    console.log('  - lastName (Last Name)');
    console.log('  - age (Age - number)');
    console.log('  - dob (Date of Birth - YYYY-MM-DD format)');
    console.log('  - sex (Sex - M/F)');
    console.log('  - room (Room Number)');
    console.log('  - physician (Primary Physician)');
    console.log('');
    console.log('Additional Information:');
    console.log('  - allergies (Allergies)');
    console.log('  - diagnoses (Diagnoses)');
    console.log('  - diet (Diet)');
    console.log('  - adminInstructions (Administration Instructions)');
    console.log('');
    console.log('Examples:');
    console.log('  fill firstName John');
    console.log('  fill lastName Doe');
    console.log('  fill age 45');
    console.log('  fill dob 1979-05-15');
    console.log('  fill sex M');
    console.log('  fill room 205');
    console.log('  fill physician "Dr. Johnson"');
  }

  showVitalFields() {
    console.log('\n🩺 Vital Signs Field Names:');
    console.log('  - bloodPressureSystolic (BP Systolic - e.g., 120)');
    console.log('  - bloodPressureDiastolic (BP Diastolic - e.g., 80)');
    console.log('  - temperature (Temperature - e.g., 98.6)');
    console.log('  - temperatureUnit (Temperature Unit - F or C)');
    console.log('  - pulse (Pulse - BPM)');
    console.log('  - respiration (Respiration - per minute)');
    console.log('  - oxygenSaturation (O2 Saturation - %)');
    console.log('  - painLevel (Pain Level - 0-10)');
    console.log('  - notes (Additional Notes)');
    console.log('');
    console.log('Examples:');
    console.log('  fill bloodPressureSystolic 120');
    console.log('  fill bloodPressureDiastolic 80');
    console.log('  fill temperature 98.6');
    console.log('  select temperatureUnit F');
    console.log('  fill pulse 72');
    console.log('  fill respiration 16');
    console.log('  fill oxygenSaturation 98');
    console.log('  fill painLevel 3');
    console.log('  fill notes "Patient stable"');
  }

  async saveVitals() {
    try {
      console.log('💾 Clicking Save Entry button...');
      
      const saveSelectors = [
        'text="Save Entry"',
        'button:has-text("Save Entry")',
        'button:has-text("Save")',
        '.bg-blue-600'
      ];
      
      let clicked = false;
      for (const selector of saveSelectors) {
        try {
          await this.page.click(selector);
          clicked = true;
          console.log('✅ Save Entry button clicked successfully');
          break;
        } catch (e) {
          // Continue to next selector
        }
      }
      
      if (!clicked) {
        throw new Error('Could not find Save Entry button');
      }
      
      // Wait for form to close
      await this.page.waitForTimeout(2000);
      
    } catch (error) {
      console.log(`❌ Failed to click Save Entry: ${error.message}`);
    }
  }

  async addVitalSigns(patientId, bp, hr, temp, tempUnit, resp, o2sat) {
    try {
      console.log(`🩺 Adding vital signs for patient ${patientId}: BP=${bp}, HR=${hr}, Temp=${temp}°${tempUnit}, Resp=${resp}, O2=${o2sat}...`);
      
      // Navigate to patient page if not already there
      if (!this.page.url().includes(`/patient/${patientId}`)) {
        await this.page.goto(`http://localhost:3000/patient/${patientId}`);
        await this.page.waitForTimeout(2000);
      }
      
      // Click Add Entry button in vital signs card
      try {
        await this.page.getByText('Add Entry').click();
      } catch (e) {
        // Try alternative selectors
        await this.page.getByRole('button', { name: 'Add Entry' }).click();
      }
      
      // Wait for editing mode to appear
      await this.page.waitForTimeout(1000);
      
      // Fill vital signs form (using placeholder-based selectors)
      const bpParts = bp.split('/');
      if (bpParts.length === 2) {
        await this.page.fill('input[placeholder="120"]', bpParts[0]); // BP Systolic
        await this.page.fill('input[placeholder="80"]', bpParts[1]);  // BP Diastolic
      }
      await this.page.fill('input[placeholder="98.6"]', temp.toString()); // Temperature
      
      // Set temperature unit
      await this.page.selectOption('select', tempUnit); // Temperature unit dropdown
      
      await this.page.fill('input[placeholder="72"]', hr.toString());     // Pulse
      await this.page.fill('input[placeholder="16"]', resp.toString());   // Respiration
      await this.page.fill('input[placeholder="98"]', o2sat.toString());  // O2 Saturation
      await this.page.fill('textarea[placeholder*="Additional notes"]', 'Added via automation'); // Notes
      
      // Click Save button and end command
      const saveButton = this.page.locator('button:has-text("Save")').first();
      await saveButton.click();
      
      console.log(`✅ Successfully filled vital signs for patient ${patientId}`);
      console.log(`📋 Command completed. Please click "Add Entry" in the confirmation modal to save.`);
    } catch (error) {
      console.log(`❌ Failed to add vital signs: ${error.message}`);
      console.log(`💡 Try using individual commands like:`);
      console.log(`   goto /patient/${patientId}`);
      console.log(`   click Add Entry`);
      console.log(`   fill bloodPressureSystolic ${bp.split('/')[0] || '120'}`);
      console.log(`   fill bloodPressureDiastolic ${bp.split('/')[1] || '80'}`);
      console.log(`   fill pulse ${hr}`);
    }
  }

  async savePatient() {
    try {
      console.log('💾 Clicking Save Patient button...');
      
      const saveSelectors = [
        'text="Save Patient"',
        'text="Save Changes"',
        'button:has-text("Save Patient")',
        'button:has-text("Save Changes")',
        '.btn-primary',
        'form button[type="submit"]'
      ];
      
      let clicked = false;
      for (const selector of saveSelectors) {
        try {
          await this.page.click(selector);
          clicked = true;
          console.log('✅ Save Patient button clicked successfully');
          break;
        } catch (e) {
          // Continue to next selector
        }
      }
      
      if (!clicked) {
        throw new Error('Could not find Save Patient button');
      }
      
      // Wait for modal to close
      await this.page.waitForTimeout(2000);
      
    } catch (error) {
      console.log(`❌ Failed to click Save Patient: ${error.message}`);
    }
  }

  async refreshPage() {
    try {
      console.log('🔄 Refreshing page...');
      await this.page.reload();
      await this.page.waitForTimeout(2000);
      console.log('✅ Page refreshed successfully');
    } catch (error) {
      console.log(`❌ Failed to refresh page: ${error.message}`);
    }
  }

  async startInteractiveMode() {
    await this.initialize();
    
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log('\n🎭 Interactive MatrixCare browser control started!');
    this.showHelp();

    const askCommand = () => {
      this.rl.question('\nEnter command: ', async (command) => {
        const trimmedCommand = command.trim();
        
        if (trimmedCommand.toLowerCase() === 'quit' || trimmedCommand.toLowerCase() === 'exit') {
          console.log('🛑 Closing browser...');
          await this.close();
          return;
        }
        
        if (trimmedCommand) {
          await this.executeCommand(trimmedCommand);
        }
        
        askCommand(); // Ask for next command
      });
    };

    askCommand();
  }

  async close() {
    if (this.rl) {
      this.rl.close();
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
      console.log('🧹 Browser closed');
    }
    process.exit(0);
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down...');
  process.exit(0);
});

// Start interactive mode
const automation = new InteractiveAutomation();
automation.startInteractiveMode().catch(console.error); 