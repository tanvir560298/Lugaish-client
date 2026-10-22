import { useState } from "react";

export function CourseAnnouncementPreview({ course }) {
  const [message, setMessage] = useState("");
  const title = course.title.trim() || "Your next skill starts here";
  const description = course.description.trim() || "A new learning experience from Lugaish.";
  const courseUrl = `${window.location.origin}/course/${encodeURIComponent(course.language)}`;
  const published = course.status === "published";
  const caption = `নতুন কোর্স: ${title} 🎓\n\n${description}\n\n${published ? `বিস্তারিত দেখুন ও শেখা শুরু করুন: ${courseUrl}` : "Course link যোগ করতে আগে এটি publish করুন."}\n\n#Lugaish #LearnTogether`;

  async function copyCaption() {
    try {
      await navigator.clipboard.writeText(caption);
      setMessage("Facebook caption copied.");
    } catch {
      setMessage("Could not copy automatically. Select and copy the caption below.");
    }
  }

  function downloadCard() {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const context = canvas.getContext("2d");
    if (!context) return setMessage("Image download is unavailable in this browser.");
    const background = context.createLinearGradient(0, 0, 1200, 630);
    background.addColorStop(0, "#102a31");
    background.addColorStop(1, "#1b3a39");
    context.fillStyle = background;
    context.fillRect(0, 0, 1200, 630);
    context.fillStyle = "#84e4d6";
    context.beginPath();
    context.arc(1080, 80, 220, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 0.12;
    context.fillStyle = "#fff";
    context.beginPath();
    context.arc(1080, 80, 160, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 1;
    context.fillStyle = "#84e4d6";
    context.font = "700 28px Arial, sans-serif";
    context.letterSpacing = "5px";
    context.fillText("LUGAISH  ·  LEARN TOGETHER", 76, 92);
    context.fillStyle = "#fff";
    context.font = "700 66px Arial, sans-serif";
    context.letterSpacing = "0px";
    const words = title.split(/\s+/);
    const lines = [];
    let line = "";
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (context.measureText(next).width > 1000 && line) {
        lines.push(line);
        line = word;
      } else line = next;
    }
    if (line) lines.push(line);
    lines.slice(0, 2).forEach((text, index) => context.fillText(text, 76, 278 + index * 82));
    context.fillStyle = "#c4d8d4";
    context.font = "400 28px Arial, sans-serif";
    context.fillText("Explore the course and start learning", 76, 475);
    context.fillStyle = "#84e4d6";
    context.beginPath();
    context.roundRect(76, 515, 260, 56, 10);
    context.fill();
    context.fillStyle = "#102a31";
    context.font = "700 22px Arial, sans-serif";
    context.fillText("EXPLORE COURSE  →", 76, 548);
    canvas.toBlob((blob) => {
      if (!blob) return setMessage("Could not prepare the image. Please retry.");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `lugaish-${course.language}-course.png`;
      link.click();
      URL.revokeObjectURL(url);
      setMessage("Facebook post image downloaded.");
    }, "image/png");
  }

  return (
    <section className="campus-card course-announcement" aria-labelledby="course-announcement-title">
      <div className="course-announcement-copy">
        <p className="platform-eyebrow">COURSE LAUNCH KIT</p>
        <h2 id="course-announcement-title">Facebook post preview</h2>
        <p>Prepare a consistent Lugaish announcement. Review the title and description before sharing.</p>
        <label>
          Caption preview
          <textarea readOnly rows={6} value={caption} onFocus={(event) => event.target.select()} />
        </label>
        <div className="platform-actions">
          <button type="button" className="campus-button campus-button-primary" onClick={copyCaption}>Copy caption</button>
          <button type="button" className="campus-button campus-button-secondary" onClick={downloadCard}>Download post image</button>
          {published ? <a className="campus-button campus-button-secondary" href={courseUrl} target="_blank" rel="noreferrer">Preview course page</a> : <button type="button" className="campus-button campus-button-secondary" disabled title="Publish the course to preview its student page">Publish course to enable preview</button>}
        </div>
        <p role="status" aria-live="polite">{message}</p>
        <p className="course-announcement-note">This prepares the post for review. Facebook auto-publishing is not connected yet.</p>
      </div>
      <div className="course-social-card" aria-label={`Social post image preview: ${title}`}>
        <span>LUGAISH <i>·</i> LEARN TOGETHER</span>
        <strong>{title}</strong>
        <small>Explore the course and start learning</small>
        <b>EXPLORE COURSE →</b>
        <i className="course-social-orb" aria-hidden="true" />
      </div>
    </section>
  );
}
