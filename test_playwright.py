# demo_visual.py
from playwright.sync_api import sync_playwright, expect
import time

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=250)  # <- show & slow
        context = browser.new_context(record_video_dir="videos/")  # optional: record video
        page = context.new_page()

        page.goto("https://playwright.dev/python/")
        
        print("Interactive browser control started!")
        print("Available commands:")
        print("- 'click [text]' - Click element with text")
        print("- 'click_role [role] [name]' - Click element by role and name")
        print("- 'type [selector] [text]' - Type text into element")
        print("- 'goto [url]' - Navigate to URL")
        print("- 'screenshot [filename]' - Take screenshot")
        print("- 'wait [seconds]' - Wait for specified seconds")
        print("- 'quit' or 'exit' - Close browser")
        print("- 'help' - Show this help")
        
        while True:
            try:
                command = input("\nEnter command: ").strip().lower()
                
                if command in ['quit', 'exit']:
                    print("Closing browser...")
                    break
                elif command == 'help':
                    print("Available commands:")
                    print("- 'click [text]' - Click element with text")
                    print("- 'click_role [role] [name]' - Click element by role and name")
                    print("- 'type [selector] [text]' - Type text into element")
                    print("- 'goto [url]' - Navigate to URL")
                    print("- 'screenshot [filename]' - Take screenshot")
                    print("- 'wait [seconds]' - Wait for specified seconds")
                    print("- 'quit' or 'exit' - Close browser")
                    print("- 'help' - Show this help")
                elif command.startswith('click '):
                    text = command[6:]  # Remove 'click ' prefix
                    try:
                        page.click(f"text={text}")
                        print(f"Clicked element with text: {text}")
                    except Exception as e:
                        print(f"Error clicking '{text}': {e}")
                elif command.startswith('click_role '):
                    parts = command.split(' ', 2)
                    if len(parts) >= 3:
                        role, name = parts[1], parts[2]
                        try:
                            page.get_by_role(role, name=name).click()
                            print(f"Clicked {role} with name: {name}")
                        except Exception as e:
                            print(f"Error clicking {role} '{name}': {e}")
                    else:
                        print("Usage: click_role [role] [name]")
                elif command.startswith('type '):
                    parts = command.split(' ', 2)
                    if len(parts) >= 3:
                        selector, text = parts[1], parts[2]
                        try:
                            page.fill(selector, text)
                            print(f"Typed '{text}' into {selector}")
                        except Exception as e:
                            print(f"Error typing into {selector}: {e}")
                    else:
                        print("Usage: type [selector] [text]")
                elif command.startswith('goto '):
                    url = command[5:]  # Remove 'goto ' prefix
                    try:
                        page.goto(url)
                        print(f"Navigated to: {url}")
                    except Exception as e:
                        print(f"Error navigating to {url}: {e}")
                elif command.startswith('screenshot '):
                    filename = command[11:]  # Remove 'screenshot ' prefix
                    try:
                        page.screenshot(path=filename, full_page=True)
                        print(f"Screenshot saved as: {filename}")
                    except Exception as e:
                        print(f"Error taking screenshot: {e}")
                elif command.startswith('wait '):
                    try:
                        seconds = float(command[5:])  # Remove 'wait ' prefix
                        time.sleep(seconds)
                        print(f"Waited {seconds} seconds")
                    except ValueError:
                        print("Usage: wait [seconds]")
                else:
                    print("Unknown command. Type 'help' for available commands.")
                    
            except KeyboardInterrupt:
                print("\nClosing browser...")
                break
            except Exception as e:
                print(f"Error: {e}")
        
        browser.close()

if __name__ == "__main__":
    main()
