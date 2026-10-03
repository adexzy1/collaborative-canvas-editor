import { Component, ElementRef, AfterViewInit, viewChild } from '@angular/core';
import { documentObjects } from './editor.state';

interface Triangle {
  id: string;
  x: number;
  y: number;
  size: number;
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
})
export class EditorComponent implements AfterViewInit {
  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  context: CanvasRenderingContext2D = null!;
  selectedObject: Triangle | null = null;
  offsetX: number = 0;
  offsetY: number = 0;
  isDragging: boolean = false;

  ngAfterViewInit() {
    this.canvas().nativeElement.width = window.innerWidth;
    this.canvas().nativeElement.height = window.innerHeight;
    this.context = this.canvas().nativeElement.getContext('2d')!;

    this.canvas().nativeElement.addEventListener('click', (event) => {
      const canvastPoint = this.getCanvasPoint(event);
      const triangle = this.hitTest(canvastPoint.x, canvastPoint.y);
      if (triangle) {
        this.selectedObject = triangle;
        this.draw();
      } else {
        this.selectedObject = null;
        this.draw();
      }
    });

    this.canvas().nativeElement.addEventListener('mousedown', (event) => {
      const canvastPoint = this.getCanvasPoint(event);
      const triangle = this.hitTest(canvastPoint.x, canvastPoint.y);
      if (triangle) {
        this.selectedObject = triangle;
        this.offsetX = canvastPoint.x - triangle.x;
        this.offsetY = canvastPoint.y - triangle.y;
        this.isDragging = true;
      }
    });

    this.canvas().nativeElement.addEventListener('mousemove', (event) => {
      if (this.selectedObject && this.isDragging) {
        const canvastPoint = this.getCanvasPoint(event);
        this.selectedObject.x = canvastPoint.x - this.offsetX;
        this.selectedObject.y = canvastPoint.y - this.offsetY;
        this.draw();
      }
    });

    this.canvas().nativeElement.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    this.draw();
  }

  draw() {
    this.context.clearRect(
      0,
      0,
      this.canvas().nativeElement.width,
      this.canvas().nativeElement.height,
    );
    documentObjects.triangles.forEach((triangle) => {
      this.drawTriangle(triangle.x, triangle.y, triangle.size);
      if (this.selectedObject && this.selectedObject.id === triangle.id) {
        this.highlightObject(triangle);
      }
    });
  }

  drawTriangle(x: number, y: number, size: number) {
    this.context.beginPath();
    this.context.moveTo(x, y);
    this.context.lineTo(x + size, y);
    this.context.lineTo(x + size / 2, y - size);
    this.context.closePath();
    this.context.fill();
  }

  hitTest(x: number, y: number): Triangle | undefined {
    return documentObjects.triangles.find(
      (triangle) =>
        triangle.x <= x &&
        x <= triangle.x + triangle.size &&
        triangle.y - triangle.size <= y &&
        y <= triangle.y,
    );
  }

  highlightObject(triangle: Triangle) {
    this.context.strokeStyle = 'red';
    this.context.lineWidth = 2;
    this.context.strokeRect(triangle.x, triangle.y - triangle.size, triangle.size, triangle.size);
  }

  getCanvasPoint(event: MouseEvent): { x: number; y: number } {
    const rect = this.canvas().nativeElement.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }
}
