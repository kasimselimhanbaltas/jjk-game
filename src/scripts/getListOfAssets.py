import os
import json


def list_assets_to_json(folder_path, output_file):
    assets = []
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            relative_path = os.path.relpath(
                os.path.join(root, file), folder_path)
            # Windows/Linux uyumluluğu için
            assets.append(relative_path.replace("\\", "/"))
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(assets, f, indent=4, ensure_ascii=False)
    print(f"Assets JSON dosyası '{output_file}' olarak kaydedildi.")


# Kullanım
assets_folder = "src/assets"
output_json = "src/assets.json"
list_assets_to_json(assets_folder, output_json)
