import React from "react";
import {
  Color,
  Rect,
  Stroke,
  BaseComponent,
  ComponentWithFill,
  ContainerComponent,
  TextComponent,
  RectangleComponent,
  EllipseComponent
} from "../componentTypes";
import CSS from "csstype";

const getRect = (rect: Rect | undefined): CSS.Properties | undefined => {
  return rect
    ? {
        position: `absolute`,
        left: `${rect.x}px`,
        top: `${rect.y}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`
      }
    : undefined;
};

const getStroke = (stroke: Stroke | undefined) => {
  return stroke
    ? {
        border: `${stroke.width}px solid rgb(${stroke.color.r}, ${stroke.color.g}, ${stroke.color.b}, ${stroke.color.a})`
      }
    : undefined;
};

const rgbaColor = (color: Color | undefined) => {
  return color
    ? `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, ${
        color.a * 255
      })`
    : "";
};

export class CompBase<T extends BaseComponent> extends React.Component<T> {
  protected component: BaseComponent | undefined;
  protected style: CSS.Properties | undefined;
  constructor(component: BaseComponent) {
    super(component as T);
    this.component = component;
    this.style = getRect(component.frame);
  }
}

export class CompWithFill<T extends ComponentWithFill> extends CompBase<T> {
  constructor(component: ComponentWithFill) {
    super(component);
    this.style = {
      ...this.style,
      ...getStroke(component.border),
      backgroundColor: rgbaColor(component.backgroundColor)
    };
  }
}

export class CompText<T extends TextComponent> extends CompBase<T> {
  constructor({ component }: { component: TextComponent }) {
    super(component);
    this.style = {
      ...this.style,
      fontSize: `${component.fontSize}px`,
      fontWeight: `${component.fontWeight}`,
      fontFamily: `${component.fontFamily}`,
      color: rgbaColor(component.textColor)
    };
  }
  render() {
    return (
      <div style={this.style}>{(this.component as TextComponent).content}</div>
    );
  }
}

export class CompRectangle<T extends RectangleComponent> extends CompWithFill<
  T
> {
  constructor({ component }: { component: RectangleComponent }) {
    super(component);
    this.style = {
      ...this.style,
      borderRadius: `${component.cornerRadius}px`
    };
  }
  render() {
    return <div style={this.style} />;
  }
}

export class CompEllipse<T extends EllipseComponent> extends CompWithFill<T> {
  constructor({ component }: { component: EllipseComponent }) {
    super(component);
    this.style = {
      ...this.style,
      borderRadius: `50%`
    };
  }
  render() {
    return <div style={this.style} />;
  }
}

export class CompContainer<T extends ContainerComponent> extends CompWithFill<
  T
> {
  constructor({ component }: { component: ContainerComponent }) {
    super(component);
    this.style = { ...this.style, borderRadius: `${component.cornerRadius}px` };
  }

  render() {
    return (
      <>
        <div style={this.style} />
        {this.component &&
          (this.component as ContainerComponent).children.map((item) => {
            switch (item.type) {
              case "container":
                return <CompContainer component={item} />;
              case "text":
                return <CompText component={item} />;
              case "rectangle":
                return <CompRectangle component={item} />;
              case "ellipse":
                return <CompEllipse component={item} />;
            }
          })}
      </>
    );
  }
}

export class ClassBody extends React.Component {
  private component: ContainerComponent;
  constructor({ component }: { component: ContainerComponent }) {
    super(component);
    this.component = component;
  }

  render() {
    return (
      <div style={{ position: "relative" }}>
        <CompContainer component={this.component} />
      </div>
    );
  }
}
