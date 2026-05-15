const AboutPage = () => {
  return (
    <div className=" bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-medium flex-shrink-0">
            RS
          </div>

          <div>
            <h1 className="text-lg font-medium text-gray-900">
              React developer in training
            </h1>
            <p className="text-sm text-gray-500">
              RS School — React course student
            </p>
          </div>
        </div>

        <p className="text-gray-600 leading-relaxed mb-6">
          Hi! I am a student currently learning React through the{' '}
          <a
            href="https://rs.school/courses/reactjs"
            className="text-blue-600 font-medium hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            RS School React course
          </a>{' '}
          — a free, community-driven program focused on building real-world
          frontend skills. This Pokédex app is one of my practical projects from
          the course.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[
            { label: 'learning', value: 'React & TypeScript' },
            { label: 'built with', value: 'PokéAPI + Tailwind' },
            { label: 'platform', value: 'RS School' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                {label}
              </p>
              <p className="text-sm font-medium text-gray-800">{value}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-4 flex items-center gap-2 text-sm text-blue-600">
          <a
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            rs.school/courses/reactjs ↗
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
