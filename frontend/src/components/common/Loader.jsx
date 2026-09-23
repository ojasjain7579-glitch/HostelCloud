const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`${sizes[size]} border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4`}></div>
      <p className="text-gray-500 font-medium">{text}</p>
    </div>
  )
}

export default Loader
