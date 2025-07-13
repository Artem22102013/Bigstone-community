import os

# Add any folder or file names to ignore here
EXCLUDED_NAMES = {"node_modules", ".git", "__pycache__", ".DS_Store"}

def print_tree(path, prefix=""):
    entries = sorted(
        [e for e in os.listdir(path) if e not in EXCLUDED_NAMES],
        key=lambda x: (not os.path.isdir(os.path.join(path, x)), x.lower())
    )
    for i, entry in enumerate(entries):
        full_path = os.path.join(path, entry)
        is_last = i == len(entries) - 1
        branch = "└── " if is_last else "├── "
        print(prefix + branch + entry)
        if os.path.isdir(full_path):
            new_prefix = prefix + ("    " if is_last else "│   ")
            print_tree(full_path, new_prefix)

# Example usage
root_path = "/Users/artem/Bigstone-community"  # Replace with your starting path
print(root_path)
print_tree(root_path)
