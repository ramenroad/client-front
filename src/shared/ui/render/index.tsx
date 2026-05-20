import { createElement, forwardRef, type ComponentPropsWithoutRef, type ComponentType, type JSX } from "react";
import { twMerge } from "tailwind-merge";

type IntrinsicTag = keyof JSX.IntrinsicElements;
type ExtendableProps = { className?: string };

const mergeClassName = (baseClassName = "", className?: string) => twMerge(baseClassName, className ?? "");

const createPrimitive = <Tag extends IntrinsicTag>(tag: Tag, baseClassName = "") => {
  const Primitive = forwardRef<unknown, ComponentPropsWithoutRef<Tag>>(({ className, ...props }, ref) =>
    createElement(tag, {
      ...(props as ComponentPropsWithoutRef<Tag>),
      ref,
      className: mergeClassName(baseClassName, className as string | undefined),
    }),
  );

  Primitive.displayName = `Render(${tag})`;

  return Primitive;
};

const extend = <Props extends ExtendableProps>(Component: ComponentType<Props>, baseClassName = "") => {
  const RenderedComponent = ({ className, ...props }: Props) => (
    <Component {...(props as Props)} className={mergeClassName(baseClassName, className)} />
  );

  RenderedComponent.displayName = `Render(${Component.displayName ?? Component.name ?? "Component"})`;

  return RenderedComponent;
};

const createIntrinsicRenderer =
  <Tag extends IntrinsicTag>(tag: Tag) =>
  (baseClassName = "") =>
    createPrimitive(tag, baseClassName);

const render = {
  a: createIntrinsicRenderer("a"),
  article: createIntrinsicRenderer("article"),
  button: createIntrinsicRenderer("button"),
  div: createIntrinsicRenderer("div"),
  figure: createIntrinsicRenderer("figure"),
  form: createIntrinsicRenderer("form"),
  h1: createIntrinsicRenderer("h1"),
  h2: createIntrinsicRenderer("h2"),
  iframe: createIntrinsicRenderer("iframe"),
  img: createIntrinsicRenderer("img"),
  input: createIntrinsicRenderer("input"),
  label: createIntrinsicRenderer("label"),
  main: createIntrinsicRenderer("main"),
  p: createIntrinsicRenderer("p"),
  section: createIntrinsicRenderer("section"),
  span: createIntrinsicRenderer("span"),
  textarea: createIntrinsicRenderer("textarea"),
  extend,
};

export default render;
