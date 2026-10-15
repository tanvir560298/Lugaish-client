# Lugaish University entrance prototype

Learning Spaces now opens a university courtyard rather than the previous illustrated card hub. A procedural student avatar enters the courtyard. Selecting Classroom, Study Room, or Speaking Practice makes it run to the corresponding doorway, which opens before the destination route loads. The destination module preloads during movement; navigation waits for both arrival and successful loading.

Desktop uses a lightweight, lazily loaded React Three Fiber scene. Mobile defaults to a CSS-built campus with a moving student and the same destinations, with an optional 3D view. Reduced motion skips the journey. Each destination also has an Enter directly link. Selected journeys offer cancellation and an immediate-entry button. Graphics failure switches to the simple entrance.

This is a small entrance prototype, not a full walkable campus. Hosting and invitations remain inside the existing Study Room. Existing authentication/course guards are retained. Development preview routes still work only in development; shared rooms require real sign-in. No avatar customization, multiplayer presence in the courtyard, or new backend behavior was added.

Changed: `src/pages/LearningSpacesPage.jsx`; added `src/university/UniversityScene.jsx`, `SimpleEntrance.jsx`, and `university.css`. No dependencies were added. All changes remain local.

Review: http://127.0.0.1:4174/learning-spaces (normal authenticated destinations) or http://127.0.0.1:4174/learning-spaces-preview (solo classroom/study previews).

Validation: production build; local Chrome checks for desktop 3D transitions to Classroom and Study Room, cancellation, direct entry, preservation of the personal timer's ID/deadline and notebook, mobile simple entrance without horizontal overflow, reduced-motion entry, and protected-route sign-in. There were no browser page errors during those checks.
