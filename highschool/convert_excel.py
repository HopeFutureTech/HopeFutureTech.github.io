#!/usr/bin/env python3
"""将 Excel 课程数据转换为网站所需的 JSON 格式。"""

import json
import os
from collections import defaultdict

import pandas as pd

EXCEL_PATH = os.path.join(os.path.dirname(__file__), '高一秋季全科系统课场次数据.xlsx')
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), 'data', 'courses.json')
SUBJECT_ORDER = ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治']


def convert():
    df = pd.read_excel(EXCEL_PATH)
    data = defaultdict(lambda: defaultdict(lambda: {
        'courseId': None,
        'courseName': '',
        'teacher': '',
        'term': '',
        'year': '',
        'sessions': []
    }))
    seen_sessions = set()

    for _, row in df.iterrows():
        subj = row['学科名称']
        course_id = str(row['课程ID'])
        session_key = (subj, course_id, row['场次ID'])

        if session_key in seen_sessions:
            continue
        seen_sessions.add(session_key)

        if data[subj][course_id]['courseId'] is None:
            data[subj][course_id].update({
                'courseId': int(row['课程ID']),
                'courseName': row['课程名称'],
                'teacher': row['主讲老师名称'],
                'term': row['学期名称'],
                'year': row['学年名称'],
            })

        data[subj][course_id]['sessions'].append({
            'id': int(row['场次ID']),
            'name': row['场次名称'],
            'video': row['课程视频'],
        })

    result = {}
    for subj in SUBJECT_ORDER:
        if subj not in data:
            continue
        courses = sorted(data[subj].values(), key=lambda x: x['courseName'])
        result[subj] = courses

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False)

    total = sum(len(c['sessions']) for courses in result.values() for c in courses)
    print(f'已生成 {OUTPUT_PATH}')
    print(f'科目: {len(result)}, 课程: {sum(len(c) for c in result.values())}, 场次: {total}')


if __name__ == '__main__':
    convert()
