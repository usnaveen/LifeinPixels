import pandas as pd
import datetime

# 1. Configuration
YEAR = 2026
FILENAME = "Life_in_Pixels_2026.xlsx"

# Activity Color Palette (Hex Codes)
# Logic: Text Color = Background Color (to hide the numbers)
# Activity Color Palette (Hex Codes)
# Logic: Text Color = Background Color (to hide the numbers)
ACTIVITY_MAP = {
    # 0: Sleep (Charcoal)
    0: {'color': '#2D3436', 'label': 'Sleep'},
    
    # 1: Work / Study (Terracotta)
    1:   {'color': '#E17055', 'label': 'Work / Study (General)'},
    1.1: {'color': '#E17055', 'label': 'Attending Classes'},
    1.2: {'color': '#E17055', 'label': 'Studying Subjects'},
    1.3: {'color': '#E17055', 'label': 'Assignments'},
    1.4: {'color': '#E17055', 'label': 'Deep Work'},
    1.5: {'color': '#E17055', 'label': 'Leetcode'},
    1.6: {'color': '#E17055', 'label': 'Projects'},

    # 2: Hobbies / Project (Soft Blue) -> Keeping generic for now or user can use 1.6
    2: {'color': '#74B9FF', 'label': 'Hobbies / Personal Project'},

    # 3: Social / Friends (Pink)
    3:   {'color': '#FD79A8', 'label': 'Social / Friends (General)'},
    3.1: {'color': '#FD79A8', 'label': 'Going Out with Friends'},
    3.2: {'color': '#FD79A8', 'label': 'Friends in Room'},
    3.3: {'color': '#FD79A8', 'label': 'Call - Friends'},
    3.4: {'color': '#FD79A8', 'label': 'Call - Family'},

    # 4: Exercise (Mint Green)
    4:   {'color': '#00B894', 'label': 'Exercise (General)'},
    4.1: {'color': '#00B894', 'label': 'Gym'},
    4.2: {'color': '#00B894', 'label': 'Jogging'},
    4.3: {'color': '#00B894', 'label': 'Yoga'},
    4.4: {'color': '#00B894', 'label': 'Swimming'},

    # 5: Relaxation (Mustard)
    5:   {'color': '#FDCB6E', 'label': 'Relaxation (General)'},
    5.1: {'color': '#FDCB6E', 'label': 'Reading Books'},
    5.2: {'color': '#FDCB6E', 'label': 'Watching Videos'},
    5.3: {'color': '#FDCB6E', 'label': 'Watching Movie'},
    5.4: {'color': '#FDCB6E', 'label': 'Meditation'},

    # 6: Misc (Grey)
    6: {'color': '#636E72', 'label': 'Travel / Misc'},

    # 7: Selfcare (Purple - New Color)
    7:   {'color': '#a29bfe', 'label': 'Selfcare (General)'},
    7.1: {'color': '#a29bfe', 'label': 'Bathing'},
    7.2: {'color': '#a29bfe', 'label': 'Toilet'},
    7.3: {'color': '#a29bfe', 'label': 'Grooming / Hygiene'},
}

def generate_pixel_tracker():
    # 2. Generate Data
    start_date = datetime.date(YEAR, 1, 1)
    end_date = datetime.date(YEAR, 12, 31)
    delta = end_date - start_date
    dates = [start_date + datetime.timedelta(days=i) for i in range(delta.days + 1)]

    # Create DataFrame (Date + 24 Hour Columns)
    # Initialize all hours to 0 (Sleep)
    hour_cols = [f"{h:02d}" for h in range(24)]
    data = {col: 0 for col in hour_cols}
    data['Date'] = dates
    
    # Reorder columns to put Date first
    cols = ['Date'] + hour_cols
    df = pd.DataFrame(data, columns=cols)

    # 3. Setup Excel Writer with XlsxWriter engine
    writer = pd.ExcelWriter(FILENAME, engine='xlsxwriter')
    df.to_excel(writer, sheet_name='Pixels', index=False)

    # Get workbook and worksheet objects
    workbook = writer.book
    worksheet = writer.sheets['Pixels']
    
    # 4. Apply Formatting
    
    # A. Define formats for each activity
    # We create a dictionary of format objects to use in conditional rules
    formats = {}
    for act_id, info in ACTIVITY_MAP.items():
        formats[act_id] = workbook.add_format({
            'bg_color': info['color'],
            'font_color': info['color'] # MATCHING FONT COLOR HIDES TEXT
        })

    # B. Apply Conditional Formatting to the Grid (Columns B to Y)
    # Calculate Excel range: B2 to Y366 (for non-leap year)
    last_row = len(df) + 1
    last_col_idx = len(cols) - 1 # 0-based index
    
    # Convert column index to Excel letter (Simple approach for known width)
    # B=1, Y=24. Range is B2:Y{last_row}
    data_range = f"B2:Y{last_row}"

    for act_id, fmt_obj in formats.items():
        worksheet.conditional_format(data_range, {
            'type':     'cell',
            'criteria': '=',
            'value':    act_id,
            'format':   fmt_obj
        })

    # C. Layout Improvements
    # Set Date column width
    worksheet.set_column('A:A', 12)
    
    # Set Hour columns width (Square pixels)
    # 2.5 units is roughly a square in Excel depending on screen DPI
    worksheet.set_column('B:Y', 2.5)
    
    # Freeze Panes (Top row and First column)
    worksheet.freeze_panes(1, 1)

    # 5. Create Legend Sheet
    legend_df = pd.DataFrame([
        {'ID': k, 'Activity': v['label'], 'Color_Hex': v['color']} 
        for k, v in ACTIVITY_MAP.items()
    ])
    legend_df.to_excel(writer, sheet_name='Legend', index=False)
    
    # Apply colors to Legend for easy reference
    legend_sheet = writer.sheets['Legend']
    for i, (act_id, info) in enumerate(ACTIVITY_MAP.items()):
        # Row i+1 because of header
        cell_format = workbook.add_format({'bg_color': info['color']})
        legend_sheet.write(i + 1, 3, "", cell_format) # Add a color block in column D

    # 6. Save
    writer.close()
    print(f"✅ Success! '{FILENAME}' has been generated with conditional formatting.")

if __name__ == "__main__":
    generate_pixel_tracker()
