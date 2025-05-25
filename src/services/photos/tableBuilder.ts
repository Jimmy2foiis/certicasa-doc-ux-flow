
import { Table, TableRow, TableCell, Paragraph, ImageRun, WidthType, HeightRule, AlignmentType } from 'docx';

export const create2x2GridProfessional = (images: Uint8Array[], title: string): Table => {
  const rows: TableRow[] = [];
  
  for (let i = 0; i < 2; i++) {
    const cells: TableCell[] = [];
    for (let j = 0; j < 2; j++) {
      const imageIndex = i * 2 + j;
      
      cells.push(new TableCell({
        children: [
          new Paragraph({
            children: [
              new ImageRun({
                data: images[imageIndex],
                transformation: {
                  width: 240,
                  height: 320
                },
                type: "jpg"
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 }
          })
        ],
        width: { size: 50, type: WidthType.PERCENTAGE },
        margins: {
          top: 100,
          bottom: 100,
          left: 100,
          right: 100,
        },
        verticalAlign: "center"
      }));
    }
    
    rows.push(new TableRow({ 
      children: cells,
      height: { value: 5000, rule: HeightRule.EXACT }
    }));
  }

  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: "single", size: 1, color: "000000" },
      bottom: { style: "single", size: 1, color: "000000" },
      left: { style: "single", size: 1, color: "000000" },
      right: { style: "single", size: 1, color: "000000" },
      insideHorizontal: { style: "single", size: 1, color: "000000" },
      insideVertical: { style: "single", size: 1, color: "000000" },
    }
  });
};
