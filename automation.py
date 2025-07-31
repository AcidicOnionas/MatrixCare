#!/usr/bin/env python3
"""
MatrixCare Interactive Automation - Python Version
Similar functionality to automation.js but using Python Playwright
"""

import asyncio
import sys
from playwright.async_api import async_playwright
import json
from datetime import datetime

class InteractiveAutomation:
    def __init__(self):
        self.browser = None
        self.page = None
        self.playwright = None

    async def initialize(self):
        if not self.browser:
            print('🚀 Starting browser...')
            self.playwright = await async_playwright().start()
            self.browser = await self.playwright.chromium.launch(
                headless=False,
                slow_mo=250  # Slow down actions for visibility
            )

            context = await self.browser.new_context(
                record_video_dir="videos/",
                record_video_size={"width": 1280, "height": 720}
            )
            self.page = await context.new_page()

            # Navigate to your MatrixCare app
            await self.page.goto('http://localhost:3000')
            print('✅ Browser ready!')

    def show_help(self):
        print('\n📋 Available commands:')
        print("- 'click [text]' - Click element with text")
        print("- 'click_role [role] [name]' - Click element by role and name")
        print("- 'fill [selector] [text]' - Fill text into element")
        print("- 'select [selector] [value]' - Select option from dropdown")
        print("- 'type [selector] [text]' - Type text into element")
        print("- 'goto [url]' - Navigate to URL")
        print("- 'screenshot [filename]' - Take screenshot")
        print("- 'wait [seconds]' - Wait for specified seconds")
        print("- 'login [email] [password]' - Quick login")
        print("- 'logout' - Quick logout")
        print("- 'add_patient [firstName] [lastName] [age] [sex] [room] [physician] [dob]' - Quick add patient")
        print("- 'save_patient' - Click Save Patient button in modal")
        print("- 'save_vitals' - Click Save Entry button in vital signs")
        print("- 'add_vitals [patientId/MRN] [bp] [hr] [temp] [tempUnit] [resp] [o2sat]' - Add vital signs (stops at confirmation)")
        print("- 'add_vitals_auto [patientId/MRN] [bp] [hr] [temp] [tempUnit] [resp] [o2sat]' - Add vital signs (auto-confirms)")
        print("- 'patient_fields' - Show all patient form field names")
        print("- 'vital_fields' - Show all vital signs field names")
        print("- 'list_patients' - Show all patients with their IDs and MRNs")
        print("- 'refresh' - Refresh the current page")
        print("- 'quit' or 'exit' - Close browser")
        print("- 'help' - Show this help")

    async def execute_command(self, command):
        lower_command = command.lower().strip()

        try:
            if lower_command == 'help':
                self.show_help()
            elif lower_command.startswith('click '):
                text = command[6:]  # Remove 'click ' prefix
                await self.click_by_text(text)
            elif lower_command.startswith('click_role '):
                parts = command.split(' ', 2)
                if len(parts) >= 3:
                    role, name = parts[1], parts[2]
                    await self.click_by_role(role, name)
                else:
                    print("Usage: click_role [role] [name]")
            elif lower_command.startswith('fill ') or lower_command.startswith('type '):
                parts = command.split(' ', 2)
                if len(parts) >= 3:
                    selector, text = parts[1], parts[2]
                    await self.fill_field(selector, text)
                else:
                    print("Usage: fill [selector] [text]")
            elif lower_command.startswith('select '):
                parts = command.split(' ', 2)
                if len(parts) >= 3:
                    selector, value = parts[1], parts[2]
                    await self.select_option(selector, value)
                else:
                    print("Usage: select [selector] [value]")
            elif lower_command.startswith('goto '):
                url = command[5:]  # Remove 'goto ' prefix
                await self.navigate(url)
            elif lower_command.startswith('screenshot '):
                filename = command[11:] or f"screenshot-{int(datetime.now().timestamp())}.png"
                await self.take_screenshot(filename)
            elif lower_command.startswith('wait '):
                try:
                    seconds = float(command[5:])
                    await self.wait(seconds)
                except ValueError:
                    print("Usage: wait [seconds]")
            elif lower_command.startswith('login '):
                parts = command.split(' ')
                if len(parts) >= 3:
                    email, password = parts[1], parts[2]
                    await self.quick_login(email, password)
                else:
                    print("Usage: login [email] [password]")
            elif lower_command == 'logout':
                await self.quick_logout()
            elif lower_command.startswith('add_patient '):
                parts = command.split(' ')
                if len(parts) >= 3:
                    firstName = parts[1]
                    lastName = parts[2]
                    age = parts[3] if len(parts) > 3 else '30'
                    sex = parts[4] if len(parts) > 4 else 'M'
                    room = parts[5] if len(parts) > 5 else '101'
                    physician = parts[6] if len(parts) > 6 else 'Dr. Smith'
                    dob = parts[7] if len(parts) > 7 else None
                    await self.quick_add_patient(firstName, lastName, age, sex, room, physician, dob)
                else:
                    print("Usage: add_patient [firstName] [lastName] [age] [sex] [room] [physician] [dob]")
                    print("Example: add_patient John Doe 45 M 101 'Dr. Smith' 1979-05-15")
            elif lower_command == 'save_patient':
                await self.save_patient()
            elif lower_command == 'save_vitals':
                await self.save_vitals()
            elif lower_command.startswith('add_vitals '):
                parts = command.split(' ')
                if len(parts) >= 2:
                    patient_identifier = parts[1] or '1'  # Can be ID or MRN
                    bp = parts[2] if len(parts) > 2 else '120/80'
                    hr = parts[3] if len(parts) > 3 else '72'
                    temp = parts[4] if len(parts) > 4 else '98.6'
                    temp_unit = parts[5] if len(parts) > 5 else 'F'
                    resp = parts[6] if len(parts) > 6 else '16'
                    o2sat = parts[7] if len(parts) > 7 else '98'
                    await self.add_vital_signs(patient_identifier, bp, hr, temp, temp_unit, resp, o2sat, False)
                else:
                    print("Usage: add_vitals [patientId/MRN] [bp] [hr] [temp] [tempUnit] [resp] [o2sat]")
                    print("Example: add_vitals 1 120/80 72 98.6 F 16 98")
                    print("Example: add_vitals MRN1234567 120/80 72 37.0 C 16 98")
            elif lower_command.startswith('add_vitals_auto '):
                parts = command.split(' ')
                if len(parts) >= 2:
                    patient_identifier = parts[1] or '1'  # Can be ID or MRN
                    bp = parts[2] if len(parts) > 2 else '120/80'
                    hr = parts[3] if len(parts) > 3 else '72'
                    temp = parts[4] if len(parts) > 4 else '98.6'
                    temp_unit = parts[5] if len(parts) > 5 else 'F'
                    resp = parts[6] if len(parts) > 6 else '16'
                    o2sat = parts[7] if len(parts) > 7 else '98'
                    await self.add_vital_signs(patient_identifier, bp, hr, temp, temp_unit, resp, o2sat, True)
                else:
                    print("Usage: add_vitals_auto [patientId/MRN] [bp] [hr] [temp] [tempUnit] [resp] [o2sat]")
                    print("Example: add_vitals_auto 1 120/80 72 98.6 F 16 98")
                    print("Example: add_vitals_auto MRN1234567 120/80 72 37.0 C 16 98")
            elif lower_command == 'patient_fields':
                self.show_patient_fields()
            elif lower_command == 'list_patients':
                await self.list_patients()
            elif lower_command == 'vital_fields':
                self.show_vital_fields()
            elif lower_command == 'refresh':
                await self.refresh_page()
            else:
                print("❓ Unknown command. Type 'help' for available commands.")
        except Exception as error:
            print(f"❌ Error: {error}")

    async def click_by_text(self, text):
        try:
            # Try multiple strategies to find the element
            strategies = [
                lambda: self.page.get_by_text(text, exact=False).first,
                lambda: self.page.get_by_text(text, exact=True).first,
                lambda: self.page.locator(f"text={text}").first,
                lambda: self.page.locator(f'"{text}"').first
            ]

            for strategy in strategies:
                try:
                    element = strategy()
                    if await element.count() > 0:
                        await element.click()
                        print(f"✅ Clicked element with text: {text}")
                        return
                except:
                    continue
            
            raise Exception(f"Could not find element with text: {text}")
        except Exception as error:
            print(f"❌ Error clicking '{text}': {error}")

    async def click_by_role(self, role, name):
        try:
            await self.page.get_by_role(role, name=name).click()
            print(f"✅ Clicked {role} with name: {name}")
        except Exception as error:
            print(f"❌ Error clicking {role} '{name}': {error}")

    async def fill_field(self, selector, text):
        try:
            # Special handling for vital signs fields
            vital_signs_map = {
                'bloodPressureSystolic': 'input[placeholder="120"]',
                'bloodPressureDiastolic': 'input[placeholder="80"]',
                'temperature': 'input[placeholder="98.6"]',
                'pulse': 'input[placeholder="72"]',
                'respiration': 'input[placeholder="16"]',
                'oxygenSaturation': 'input[placeholder="98"]',
                'painLevel': 'input[placeholder="0"]',
                'notes': 'textarea[placeholder*="Additional notes"]'
            }

            if selector in vital_signs_map:
                element = self.page.locator(vital_signs_map[selector])
                await element.clear()
                await element.fill(text)
                print(f"✅ Filled vital signs '{selector}' with '{text}'")
                return

            # Try different strategies to find form fields
            strategies = [
                lambda: self.page.get_by_label(selector),
                lambda: self.page.get_by_placeholder(selector),
                lambda: self.page.locator(f'[name="{selector}"]'),
                lambda: self.page.locator(f'[id="{selector}"]'),
                lambda: self.page.locator(selector)
            ]

            for strategy in strategies:
                try:
                    element = strategy()
                    if await element.count() > 0:
                        await element.clear()
                        await element.fill(text)
                        print(f"✅ Filled '{selector}' with '{text}'")
                        return
                except:
                    continue
            
            raise Exception(f"Could not find field: {selector}")
        except Exception as error:
            print(f"❌ Error filling {selector}: {error}")

    async def select_option(self, selector, value):
        try:
            # Special handling for vital signs dropdowns
            if selector == 'temperatureUnit':
                temp_unit_select = self.page.locator('select').filter(has_text='°F').or_(
                    self.page.locator('select').filter(has_text='°C')
                )
                if await temp_unit_select.count() > 0:
                    await temp_unit_select.select_option(value)
                    print(f"✅ Selected temperature unit '{value}'")
                    return

            # Try different strategies to find dropdown
            strategies = [
                lambda: self.page.get_by_label(selector),
                lambda: self.page.locator(f'[name="{selector}"]'),
                lambda: self.page.locator(f'[id="{selector}"]'),
                lambda: self.page.locator(f'select[name="{selector}"]'),
                lambda: self.page.locator(selector)
            ]

            for strategy in strategies:
                try:
                    element = strategy()
                    if await element.count() > 0:
                        await element.wait_for(state='visible')
                        await element.select_option(value)
                        print(f"✅ Selected '{value}' in '{selector}'")
                        return
                except:
                    continue
            
            raise Exception(f"Could not find dropdown: {selector}")
        except Exception as error:
            print(f"❌ Error selecting option in {selector}: {error}")

    async def navigate(self, url):
        try:
            full_url = url if url.startswith('http') else f'http://localhost:3000{url}'
            await self.page.goto(full_url)
            print(f"✅ Navigated to: {full_url}")
        except Exception as error:
            print(f"❌ Error navigating to {url}: {error}")

    async def take_screenshot(self, filename):
        try:
            await self.page.screenshot(path=filename, full_page=True)
            print(f"✅ Screenshot saved as: {filename}")
        except Exception as error:
            print(f"❌ Error taking screenshot: {error}")

    async def wait(self, seconds):
        try:
            await self.page.wait_for_timeout(seconds * 1000)
            print(f"✅ Waited {seconds} seconds")
        except Exception as error:
            print(f"❌ Error waiting: {error}")

    async def quick_login(self, email, password):
        try:
            print(f"🔐 Attempting to login with {email}...")
            
            if '/login' not in self.page.url:
                await self.page.goto('http://localhost:3000/login')
            
            await self.page.fill('[name="email"]', email)
            await self.page.fill('[name="password"]', password)
            await self.page.click('button[type="submit"]')
            
            await self.page.wait_for_url('**/dashboard', timeout=5000)
            print(f"✅ Successfully logged in as {email}")
        except Exception as error:
            print(f"❌ Login failed: {error}")

    async def quick_logout(self):
        try:
            print("🚪 Logging out...")
            await self.page.goto('http://localhost:3000/login')
            print("✅ Navigated to login page (logout fallback)")
        except Exception as error:
            print(f"❌ Logout failed: {error}")

    async def quick_add_patient(self, first_name, last_name, age='30', sex='M', room='101', physician='Dr. Smith', dob_input=None):
        try:
            # Calculate or use provided date of birth
            if dob_input:
                dob = dob_input
                print(f"👤 Adding patient: {first_name} {last_name}, DOB: {dob}, Sex: {sex}, Room: {room}, Physician: {physician}...")
            else:
                current_year = datetime.now().year
                birth_year = current_year - int(age)
                dob = f"{birth_year}-01-01"
                print(f"👤 Adding patient: {first_name} {last_name}, Age: {age} (DOB: {dob}), Sex: {sex}, Room: {room}, Physician: {physician}...")
            
            # Click Add Patient button
            await self.page.get_by_role('button', name='Add Patient').first.click()
            await self.page.wait_for_timeout(1000)
            
            # Fill patient form
            await self.page.fill('[name="firstName"]', first_name)
            await self.page.fill('[name="lastName"]', last_name)
            await self.page.fill('[name="dob"]', dob)
            
            try:
                await self.page.fill('[name="age"]', str(age))
            except:
                pass  # Age field might not exist
            
            # Fill sex field
            sex_value = 'M' if sex.upper() == 'M' else 'F' if sex.upper() == 'F' else 'M'
            await self.page.fill('[name="sex"]', sex_value)
            
            await self.page.fill('[name="room"]', room)
            await self.page.fill('[name="physician"]', physician)
            await self.page.fill('[name="allergies"]', 'None')
            await self.page.fill('[name="diagnoses"]', 'General Care')
            await self.page.fill('[name="diet"]', 'Regular')
            await self.page.fill('[name="adminInstructions"]', 'Standard care protocols')
            
            # Submit form
            await self.page.click('button[type="submit"]')
            await self.page.wait_for_timeout(2000)
            
            print(f"✅ Successfully added patient: {first_name} {last_name}")
        except Exception as error:
            print(f"❌ Failed to add patient: {error}")

    async def save_patient(self):
        try:
            print('💾 Clicking Save Patient button...')
            
            save_selectors = [
                'text="Save Patient"',
                'text="Save Changes"',
                'button:has-text("Save Patient")',
                'button:has-text("Save Changes")',
                '.btn-primary',
                'form button[type="submit"]'
            ]
            
            for selector in save_selectors:
                try:
                    await self.page.click(selector)
                    print('✅ Save Patient button clicked successfully')
                    await self.page.wait_for_timeout(2000)
                    return
                except:
                    continue
            
            raise Exception('Could not find Save Patient button')
        except Exception as error:
            print(f"❌ Failed to click Save Patient: {error}")

    async def save_vitals(self):
        try:
            print('💾 Clicking Save Entry button...')
            
            save_selectors = [
                'text="Save Entry"',
                'button:has-text("Save Entry")',
                'button:has-text("Save")',
                '.bg-blue-600'
            ]
            
            for selector in save_selectors:
                try:
                    await self.page.click(selector)
                    print('✅ Save Entry button clicked successfully')
                    await self.page.wait_for_timeout(2000)
                    return
                except:
                    continue
            
            raise Exception('Could not find Save Entry button')
        except Exception as error:
            print(f"❌ Failed to click Save Entry: {error}")

    def show_patient_fields(self):
        print('\n📋 Patient Form Field Names:')
        print('Basic Information:')
        print('  - firstName (First Name)')
        print('  - lastName (Last Name)')
        print('  - age (Age - number)')
        print('  - dob (Date of Birth - YYYY-MM-DD format)')
        print('  - sex (Sex - M/F)')
        print('  - room (Room Number)')
        print('  - physician (Primary Physician)')
        print('')
        print('Additional Information:')
        print('  - allergies (Allergies)')
        print('  - diagnoses (Diagnoses)')
        print('  - diet (Diet)')
        print('  - adminInstructions (Administration Instructions)')
        print('')
        print('Examples:')
        print('  fill firstName John')
        print('  fill lastName Doe')
        print('  fill age 45')
        print('  fill dob 1979-05-15')
        print('  fill sex M')
        print('  fill room 205')
        print('  fill physician "Dr. Johnson"')

    def show_vital_fields(self):
        print('\n🩺 Vital Signs Field Names:')
        print('  - bloodPressureSystolic (BP Systolic - e.g., 120)')
        print('  - bloodPressureDiastolic (BP Diastolic - e.g., 80)')
        print('  - temperature (Temperature - e.g., 98.6)')
        print('  - temperatureUnit (Temperature Unit - F or C)')
        print('  - pulse (Pulse - BPM)')
        print('  - respiration (Respiration - per minute)')
        print('  - oxygenSaturation (O2 Saturation - %)')
        print('  - painLevel (Pain Level - 0-10)')
        print('  - notes (Additional Notes)')
        print('')
        print('Examples:')
        print('  fill bloodPressureSystolic 120')
        print('  fill bloodPressureDiastolic 80')
        print('  fill temperature 98.6')
        print('  select temperatureUnit F')
        print('  fill pulse 72')
        print('  fill respiration 16')
        print('  fill oxygenSaturation 98')
        print('  fill painLevel 3')
        print('  fill notes "Patient stable"')

    async def refresh_page(self):
        try:
            print('🔄 Refreshing page...')
            await self.page.reload()
            await self.page.wait_for_timeout(2000)
            print('✅ Page refreshed successfully')
        except Exception as error:
            print(f"❌ Failed to refresh page: {error}")

    async def start_interactive_mode(self):
        await self.initialize()
        
        print('\n🎭 Interactive MatrixCare browser control started!')
        self.show_help()

        while True:
            try:
                command = input('\nEnter command: ').strip()
                
                if command.lower() in ['quit', 'exit']:
                    print('🛑 Closing browser...')
                    await self.close()
                    break
                
                if command:
                    await self.execute_command(command)
                    
            except KeyboardInterrupt:
                print('\n🛑 Shutting down...')
                await self.close()
                break
            except Exception as error:
                print(f"Error: {error}")

    async def add_vital_signs(self, patient_identifier, bp, hr, temp, temp_unit, resp, o2sat, auto_confirm=False):
        try:
            print(f"🩺 Adding vital signs for patient {patient_identifier}: BP={bp}, HR={hr}, Temp={temp}°{temp_unit}, Resp={resp}, O2={o2sat}...")
            
            # Determine if identifier is MRN or ID and get the actual patient ID
            patient_id = patient_identifier
            if str(patient_identifier).startswith('MRN'):
                print(f"🔍 Looking up patient by MRN: {patient_identifier}")
                try:
                    import aiohttp
                    async with aiohttp.ClientSession() as session:
                        async with session.get(f"http://localhost:8080/api/patients/mrn/{patient_identifier}") as response:
                            if response.status == 200:
                                patient = await response.json()
                                patient_id = patient['id']
                                print(f"✅ Found patient: {patient['firstName']} {patient['lastName']} (ID: {patient_id})")
                            else:
                                raise Exception(f"Patient with MRN {patient_identifier} not found")
                except Exception as error:
                    print(f"❌ Failed to lookup patient by MRN: {error}")
                    return
            
            # Navigate to patient page if not already there
            if f"/patient/{patient_id}" not in self.page.url:
                await self.page.goto(f"http://localhost:3000/patient/{patient_id}")
                await self.page.wait_for_timeout(2000)
            
            # Click Add Entry button in vital signs card
            try:
                await self.page.get_by_text('Add Entry').click()
            except:
                # Try alternative selectors
                await self.page.get_by_role('button', name='Add Entry').click()
            
            # Wait for editing mode to appear
            await self.page.wait_for_timeout(1000)
            
            # Fill vital signs form (using placeholder-based selectors)
            bp_parts = bp.split('/')
            if len(bp_parts) == 2:
                await self.page.fill('input[placeholder="120"]', bp_parts[0])  # BP Systolic
                await self.page.fill('input[placeholder="80"]', bp_parts[1])   # BP Diastolic
            
            await self.page.fill('input[placeholder="98.6"]', str(temp))  # Temperature
            
            # Set temperature unit
            await self.page.select_option('select', temp_unit)  # Temperature unit dropdown
            
            await self.page.fill('input[placeholder="72"]', str(hr))      # Pulse
            await self.page.fill('input[placeholder="16"]', str(resp))    # Respiration
            await self.page.fill('input[placeholder="98"]', str(o2sat))   # O2 Saturation
            await self.page.fill('textarea[placeholder*="Additional notes"]', 'Added via automation')  # Notes
            
            # Click Save button (this will trigger the confirmation modal)
            save_button = self.page.locator('button:has-text("Save")').first
            await save_button.click()
            
            if auto_confirm:
                # Wait for confirmation modal to appear
                await self.page.wait_for_timeout(1000)
                
                # Click the "Add Entry" button in the confirmation modal
                try:
                    confirm_button = self.page.locator('button:has-text("Add Entry")').last
                    await confirm_button.click()
                    
                    # Wait for modal to close and data to be saved
                    await self.page.wait_for_timeout(2000)
                    
                    print(f"✅ Successfully added vital signs for patient {patient_identifier} (ID: {patient_id})")
                    print(f"📋 Command completed. Vital signs have been saved automatically.")
                except Exception as error:
                    print(f"⚠️ Auto-confirmation failed: {error}")
                    print(f"💡 Please manually click 'Add Entry' in the confirmation modal.")
            else:
                # Wait briefly for the modal to appear
                await self.page.wait_for_timeout(500)
                
                print(f"✅ Successfully triggered vital signs entry for patient {patient_identifier} (ID: {patient_id})")
                print(f"📋 Command completed. Please confirm the entry in the modal that appeared.")
                print(f"💡 The confirmation modal should now be visible - click 'Add Entry' to save.")
            
        except Exception as error:
            print(f"❌ Failed to add vital signs: {error}")
            print(f"💡 Try using individual commands like:")
            print(f"   goto /patient/{patient_id if 'patient_id' in locals() else patient_identifier}")
            print(f"   click Add Entry")
            print(f"   fill bloodPressureSystolic {bp.split('/')[0] if '/' in bp else '120'}")
            print(f"   fill bloodPressureDiastolic {bp.split('/')[1] if '/' in bp else '80'}")
            print(f"   fill pulse {hr}")

    async def list_patients(self):
        try:
            print('📋 Fetching patient list...')
            import aiohttp
            async with aiohttp.ClientSession() as session:
                async with session.get('http://localhost:8080/api/patients') as response:
                    if response.status == 200:
                        patients = await response.json()
                        print('\n👥 Patient List:')
                        print('=====================================')
                        for patient in patients:
                            room = patient.get('roomNumber', 'N/A')
                            print(f"ID: {patient['id']} | MRN: {patient['medicalRecordNumber']} | Name: {patient['firstName']} {patient['lastName']} | Room: {room}")
                        print('=====================================')
                        print(f'Total patients: {len(patients)}')
                    else:
                        raise Exception('Failed to fetch patients')
        except Exception as error:
            print(f"❌ Failed to fetch patients: {error}")

    async def close(self):
        if self.browser:
            await self.browser.close()
            self.browser = None
            self.page = None
            print('🧹 Browser closed')
        if self.playwright:
            await self.playwright.stop()

async def main():
    automation = InteractiveAutomation()
    await automation.start_interactive_mode()

if __name__ == "__main__":
    asyncio.run(main()) 