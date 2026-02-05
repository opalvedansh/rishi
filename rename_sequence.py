import os

folder = "/Users/vedansh/Desktop/rishi/public/frame-sequence"
files = [f for f in os.listdir(folder) if f.endswith('.jpg')]
files.sort()

print(f"Found {len(files)} images.")

for i, filename in enumerate(files):
    old_path = os.path.join(folder, filename)
    new_name = f"{i+1}.jpg"
    new_path = os.path.join(folder, new_name)
    os.rename(old_path, new_path)

print("Renaming complete.")
