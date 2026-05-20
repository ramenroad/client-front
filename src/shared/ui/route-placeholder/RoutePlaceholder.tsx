interface RoutePlaceholderProps {
  title: string
  route: string
}

export const RoutePlaceholder = ({ title, route }: RoutePlaceholderProps) => {
  return (
    <main className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-white px-20 py-32 text-center">
      <p className="font-12-m text-orange">Route only</p>
      <h1 className="mt-8 font-22-b text-gray-900">{title}</h1>
      <p className="mt-8 font-14-r text-gray-500">{route}</p>
    </main>
  )
}
