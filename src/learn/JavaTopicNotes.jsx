import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Copy,
  Check,
  Code2,
  Terminal,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  BookOpen
} from 'lucide-react';

function CodeSnippet({ code, language = 'java', title }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: '#090d16', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', overflow: 'hidden', margin: '12px 0 16px' }}>
      {title && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <span style={{ fontSize: '11px', color: '#fbbf24', fontFamily: 'monospace', fontWeight: 600 }}>
            {title}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            style={{
              background: 'transparent',
              border: 'none',
              color: copied ? '#34d399' : 'var(--lx-muted)',
              cursor: 'pointer',
              fontSize: '11px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      <pre style={{ margin: 0, padding: '14px', fontSize: '12.5px', lineHeight: 1.6, color: '#f1f5f9', fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace', overflowX: 'auto', whiteSpace: 'pre' }}>
        {code}
      </pre>
    </div>
  );
}

export function JavaTopicNotes({ video, onSwitchToPractice }) {
  if (video.id === '02') {
    const sections = [
      {
        title: '1. Turn a formula into an expression',
        text: 'An operator acts on values; an expression produces a value. Use + for addition, - for subtraction and * for multiplication. Read the quantities first, then translate the formula. Multiplication and division happen before addition and subtraction; parentheses make the intended grouping explicit.',
        code: 'int energy = power * panels * hours;\nint area = length * width;\nint fence = 2 * (length + width);\nint finalPoints = (base + bonus - penalty) * multiplier;',
        tip: 'For base = 120, bonus = 35, penalty = 15 and multiplier = 3, the grouped score is 420. Without the parentheses, you change the formula.',
        problems: [['Solar Farm Daily Output', 'solar-farm-daily-output'], ['Garden Plot Designer', 'garden-plot-designer'], ['Arcade Score Booster', 'arcade-score-booster']]
      },
      {
        title: '2. Whole groups and leftovers',
        text: 'With integer operands, / performs integer division and discards the fractional part (toward zero). The % operator gives the remainder. For these nonnegative inputs, quotient counts complete groups and remainder counts items left over. The divisor must not be zero.',
        code: 'int packs = 146 / 12;       // 12\nint loose = 146 % 12;       // 2\nint hours = totalSeconds / 3600;\nint minutes = (totalSeconds % 3600) / 60;\nint seconds = totalSeconds % 60;',
        tip: '7384 seconds becomes 2h 3m 4s. Remove the complete hours before calculating the remaining minutes.',
        problems: [['Sticker Pack Machine', 'sticker-pack-machine'], ['Race Clock Formatter', 'race-clock-formatter']]
      },
      {
        title: '3. Update a value step by step',
        text: 'Assignment stores a result. For an int counter, counter += amount adds to its current value; -= subtracts. Keep intermediate results when the problem asks for more than the final state. Postfix x++ returns the old value before incrementing; prefix ++x increments first and returns the new value. Decrement works the same way.',
        code: 'int battery = 480;\nbattery += 70;             // 550: after charging\nbattery -= 210;            // 340: after the mission\n\nint counter = 7;\nint first = counter++;     // first = 7, counter = 8\nint second = ++counter;    // second = 9, counter = 9\nint third = counter--;     // third = 9, counter = 8\nint fourth = --counter;    // fourth = 7, counter = 7',
        tip: 'Trace each statement separately. Do not assume all four variables receive the final counter value.',
        problems: [['Robot Charging Log', 'robot-charging-log'], ['Turnstile Counter Mystery', 'turnstile-counter-mystery']]
      },
      {
        title: '4. Preserve fractions and format the answer',
        text: 'Use double for fractional measurements and percentages. At least one operand of a division must be floating-point to preserve fractions: 9 / 5 is 1, but 9.0 / 5.0 is 1.8. Assigning an already-truncated integer result to double does not restore the lost fraction. Round for display, not after every calculation.',
        code: 'double score = first * 0.25 + second * 0.35 + third * 0.40;\ndouble fahrenheit = celsius * 9.0 / 5.0 + 32;\ndouble subtotal = baseFare + zones * zoneFee;\ndouble fare = subtotal * (1 - discountPercent / 100.0);\ndouble speed = distance / (minutes / 60.0);\nSystem.out.printf(java.util.Locale.US, "Speed: %.2f km/h%n", speed);',
        tip: '42 km in 80 minutes gives 31.50 km/h. A 10% discount on a subtotal of 41 gives 36.90. %.2f prints exactly two decimal places; Locale.US keeps the decimal separator as a dot.',
        problems: [['Workshop Performance Score', 'workshop-performance-score'], ['Weather Lab Converter', 'weather-lab-converter'], ['Smart Bus Fare', 'smart-bus-fare'], ['Scooter Speed Calculator', 'scooter-speed-calculator']]
      },
      {
        title: '5. Choose a type before multiplying',
        text: 'An int can hold at most 2,147,483,647. A product can overflow even when each input fits in int. Java evaluates the expression before assigning it, so a long destination alone is not enough. Read the values with nextLong(), or promote the first multiplication to long.',
        code: 'int seats = 50000, venues = 50000, sessions = 2;\nlong visits = 1L * seats * venues * sessions; // 5000000000\n// long visits = seats * venues * sessions; // int overflow first',
        tip: 'Check the maximum possible product from the constraints, not just the sample input. long also has limits, so always check the stated bounds.',
        problems: [['Festival Attendance Estimator', 'festival-attendance-estimator']]
      }
    ];
    return (
      <article className="java-operator-notes">
        <header><span className="java-eyebrow">TOPIC 02 / STUDY NOTES</span><h2>Operators &amp; Expressions</h2><p>Build expressions, track changing values, and calculate accurate results. These notes prepare you for the 12 practice challenges in this topic.</p></header>
        {sections.map(section => <section key={section.title}>
          <h3>{section.title}</h3><p>{section.text}</p>
          <CodeSnippet title="Java expressions" code={section.code} />
          <p className="java-notes-tip"><Lightbulb size={18} aria-hidden="true" /><span>{section.tip}</span></p>
          <div className="java-notes-related"><strong>Related practice</strong>{section.problems.map(([title, slug]) => <Link key={slug} to={`/practice/java/operators-expressions/${slug}`}>{title}<ArrowRight size={14} aria-hidden="true" /></Link>)}</div>
        </section>)}
        <section><h3>6. Beyond arithmetic</h3><p>These operators are foundations for later topics. The current 12 challenges focus on arithmetic and updates, rather than requiring every operator below.</p>
          <CodeSnippet title="Comparisons and decisions" code={'boolean equal = a == b;       // == compares; = assigns\nboolean different = a != b;\nboolean eligible = age >= 18 && hasTicket;\nboolean canEnter = hasPass || hasTicket;\nboolean missing = !hasTicket;\nint larger = a > b ? a : b;    // condition ? trueValue : falseValue\nint mask = 6 & 3;             // bitwise AND: 110 & 011 = 010 (2)'} />
          <p>Comparisons (&lt;, &lt;=, &gt;, &gt;=, ==, !=) produce boolean values. &amp;&amp; and || short-circuit: they skip the right operand when the left already determines the result. For integer bit operations, &amp;, | and ^ mean AND, OR and XOR; ~ flips bits, while &lt;&lt;, &gt;&gt; and &gt;&gt;&gt; shift bits. Do not confuse bitwise operators with logical operators.</p>
        </section>
        <section><h3>Before you submit</h3><ul><li>Read inputs in the exact order given, without printing input prompts.</li><li>Match output labels, spacing, units and decimal places exactly.</li><li>Check grouping, integer division and overflow before blaming formatting.</li><li>Test a smallest allowed input, an exact division, a leftover case and the maximum bounds.</li></ul>
          <button className="java-start-challenge" type="button" onClick={onSwitchToPractice}>Practice Operators &amp; Expressions <ArrowRight size={16} aria-hidden="true" /></button>
        </section>
      </article>
    );
  }
  if (video.id === '01') {
    return (
      <div className="space-y-6" style={{ padding: '4px 0' }}>
        {/* Topic Header Summary */}
        <div style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '14px', padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
            <Sparkles size={16} /> Topic 01 · Comprehensive Study Notes
          </div>
          <h2 style={{ fontSize: '24px', color: '#f8fafc', margin: '4px 0 8px' }}>
            Basic Input, Output &amp; Variables in Java
          </h2>
          <p style={{ color: '#fed7aa', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
            Master the absolute foundations of Java: understanding how the Java Virtual Machine (JVM) finds your code, printing output to the terminal, capturing dynamic user input via Scanner, and declaring typed variables.
          </p>
        </div>

        {/* Section 1: Java Program Structure */}
        <div style={{ background: 'var(--lx-panel)', border: '1px solid var(--lx-border)', borderRadius: '14px', padding: '22px' }}>
          <h3 style={{ fontSize: '18px', color: '#fbbf24', marginTop: 0, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={18} /> 1. Structure of a Java Program &amp; Entry Point
          </h3>
          <p style={{ fontSize: '13.5px', color: 'var(--lx-muted)', lineHeight: 1.7, margin: '0 0 12px' }}>
            Every standalone Java program requires a <strong>class</strong> definition and a special <strong>main method</strong>. The JVM looks specifically for this exact method signature to start execution:
          </p>

          <CodeSnippet
            title="Main.java — Minimal Working Java Program"
            code={`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}`}
          />

          <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px', padding: '12px 16px', fontSize: '12.5px', color: '#fed7aa', lineHeight: 1.7 }}>
            <strong style={{ color: '#fbbf24' }}>Case Sensitivity Rule:</strong> Java is strictly case-sensitive!
            <ul style={{ margin: '6px 0 0', paddingLeft: '20px' }}>
              <li><code>public static void main</code> cannot be written as <code>mian</code> or <code>Main</code>.</li>
              <li><code>String[]</code> must begin with a capital <code>S</code>. Using <code>string</code> will cause a compilation error.</li>
              <li><code>System.out.println</code> requires a capital <code>S</code>. Writing <code>system.out.println</code> will fail to compile.</li>
            </ul>
          </div>
        </div>

        {/* Section 2: Standard Output */}
        <div style={{ background: 'var(--lx-panel)', border: '1px solid var(--lx-border)', borderRadius: '14px', padding: '22px' }}>
          <h3 style={{ fontSize: '18px', color: '#fbbf24', marginTop: 0, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Code2 size={18} /> 2. Printing Output to the Console
          </h3>
          <p style={{ fontSize: '13.5px', color: 'var(--lx-muted)', lineHeight: 1.7, margin: '0 0 12px' }}>
            Java provides two primary methods on <code>System.out</code> for displaying text on the screen:
          </p>

          <ul style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: 1.8, margin: '0 0 14px', paddingLeft: '22px' }}>
            <li>
              <code>System.out.println(data);</code> — Prints the data followed by a <strong>new line character (\n)</strong>. The next print will start on the next line.
            </li>
            <li>
              <code>System.out.print(data);</code> — Prints the data <strong>without</strong> moving to the next line. Subsequent prints continue on the same line.
            </li>
            <li>
              <strong>String Concatenation:</strong> Use the <code>+</code> operator to combine text with variable values, e.g. <code>"Temperature: " + temp + " C"</code>.
            </li>
          </ul>

          <CodeSnippet
            title="Output Examples"
            code={`int age = 22;
String name = "Tanvir";

// Output on a single line
System.out.println("Student: " + name + ", Age: " + age);

// Print vs Println
System.out.print("Loading... ");
System.out.println("Done!");`}
          />
        </div>

        {/* Section 3: Taking User Input with Scanner */}
        <div style={{ background: 'var(--lx-panel)', border: '1px solid var(--lx-border)', borderRadius: '14px', padding: '22px' }}>
          <h3 style={{ fontSize: '18px', color: '#fbbf24', marginTop: 0, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lightbulb size={18} /> 3. Reading User Input with java.util.Scanner
          </h3>
          <p style={{ fontSize: '13.5px', color: 'var(--lx-muted)', lineHeight: 1.7, margin: '0 0 12px' }}>
            To read input from standard input (keyboard or automated test cases), import and instantiate the <code>Scanner</code> class:
          </p>

          <CodeSnippet
            title="SumOfTwoNumbers.java — Taking 2 Integers as Input"
            code={`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        // Reading two integers separated by space or newline
        int a = sc.nextInt();
        int b = sc.nextInt();

        int sum = a + b;
        System.out.println("Sum = " + sum);
        
        sc.close();
    }
}`}
          />

          <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--lx-border)', borderRadius: '8px', padding: '10px 14px' }}>
              <code style={{ color: '#38bdf8', fontWeight: 700 }}>sc.nextInt()</code>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--lx-muted)' }}>Reads a 32-bit signed integer (e.g. 42, -15)</p>
            </div>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--lx-border)', borderRadius: '8px', padding: '10px 14px' }}>
              <code style={{ color: '#38bdf8', fontWeight: 700 }}>sc.nextDouble()</code>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--lx-muted)' }}>Reads a 64-bit floating point number (e.g. 3.14159)</p>
            </div>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--lx-border)', borderRadius: '8px', padding: '10px 14px' }}>
              <code style={{ color: '#38bdf8', fontWeight: 700 }}>sc.next()</code>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--lx-muted)' }}>Reads a single word up to the next whitespace</p>
            </div>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--lx-border)', borderRadius: '8px', padding: '10px 14px' }}>
              <code style={{ color: '#38bdf8', fontWeight: 700 }}>sc.nextLine()</code>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--lx-muted)' }}>Reads an entire line of text including spaces</p>
            </div>
          </div>
        </div>

        {/* Section 4: Data Types & Variables */}
        <div style={{ background: 'var(--lx-panel)', border: '1px solid var(--lx-border)', borderRadius: '14px', padding: '22px' }}>
          <h3 style={{ fontSize: '18px', color: '#fbbf24', marginTop: 0, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={18} /> 4. Primitive Data Types in Java
          </h3>
          <p style={{ fontSize: '13.5px', color: 'var(--lx-muted)', lineHeight: 1.7, margin: '0 0 14px' }}>
            Java is a statically-typed language: every variable must have its type declared before it can store values:
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--lx-border)', textAlign: 'left', color: '#fbbf24' }}>
                  <th style={{ padding: '8px 12px' }}>Type</th>
                  <th style={{ padding: '8px 12px' }}>Size</th>
                  <th style={{ padding: '8px 12px' }}>Range / Value</th>
                  <th style={{ padding: '8px 12px' }}>Example Declaration</th>
                </tr>
              </thead>
              <tbody style={{ color: '#cbd5e1' }}>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#38bdf8' }}>int</td>
                  <td style={{ padding: '8px 12px' }}>4 bytes (32-bit)</td>
                  <td style={{ padding: '8px 12px' }}>-2,147,483,648 to 2,147,483,647</td>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>int cookies = 36;</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#38bdf8' }}>long</td>
                  <td style={{ padding: '8px 12px' }}>8 bytes (64-bit)</td>
                  <td style={{ padding: '8px 12px' }}>Large integers (~9 quintillion)</td>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>long stars = 10000000000L;</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#38bdf8' }}>double</td>
                  <td style={{ padding: '8px 12px' }}>8 bytes (64-bit)</td>
                  <td style={{ padding: '8px 12px' }}>15 decimal digits precision</td>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>double pi = 3.14159265;</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#38bdf8' }}>char</td>
                  <td style={{ padding: '8px 12px' }}>2 bytes (16-bit)</td>
                  <td style={{ padding: '8px 12px' }}>Single Unicode character in single quotes</td>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>char grade = 'A';</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#38bdf8' }}>boolean</td>
                  <td style={{ padding: '8px 12px' }}>1 bit</td>
                  <td style={{ padding: '8px 12px' }}>true or false</td>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>boolean passed = true;</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#38bdf8' }}>String</td>
                  <td style={{ padding: '8px 12px' }}>Object (Reference)</td>
                  <td style={{ padding: '8px 12px' }}>Sequence of characters in double quotes</td>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>String name = "Omar";</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 5: Common Pitfalls */}
        <div style={{ background: 'var(--lx-panel)', border: '1px solid var(--lx-border)', borderRadius: '14px', padding: '22px' }}>
          <h3 style={{ fontSize: '18px', color: '#fbbf24', marginTop: 0, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} /> 5. Common Beginner Errors &amp; How to Fix Them
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginTop: '12px' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '10px', padding: '14px' }}>
              <strong style={{ color: '#f87171', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                Compilation Error: ';' expected
              </strong>
              <p style={{ margin: 0, fontSize: '12px', color: '#fed7aa', lineHeight: 1.6 }}>
                Every statement in Java must terminate with a semicolon <code>;</code>. Forgetting it will prevent the compiler from generating bytecode.
              </p>
            </div>

            <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '10px', padding: '14px' }}>
              <strong style={{ color: '#f87171', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                ArithmeticException: / by zero
              </strong>
              <p style={{ margin: 0, fontSize: '12px', color: '#fed7aa', lineHeight: 1.6 }}>
                Dividing an integer by zero (or an expression like <code>cookies / (friends - friends)</code>) crashes your program at runtime with an <code>ArithmeticException</code>.
              </p>
            </div>

            <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '10px', padding: '14px' }}>
              <strong style={{ color: '#f87171', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                Unclosed Parenthesis: ')' expected
              </strong>
              <p style={{ margin: 0, fontSize: '12px', color: '#fed7aa', lineHeight: 1.6 }}>
                Every opening parenthesis <code>(</code> must have a matching closing parenthesis <code>)</code>. Count your pairs carefully inside print statements.
              </p>
            </div>

            <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '10px', padding: '14px' }}>
              <strong style={{ color: '#f87171', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                Cannot find symbol: class string
              </strong>
              <p style={{ margin: 0, fontSize: '12px', color: '#fed7aa', lineHeight: 1.6 }}>
                In Java, <code>String</code> is a class and must be capitalized. Writing <code>string s = sc.next();</code> will fail compilation.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action: Switch to Practice */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(217, 119, 6, 0.12) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '14px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              STEP 2 OF YOUR LEARNING JOURNEY
            </span>
            <h3 style={{ margin: '4px 0 6px', fontSize: '18px', color: '#ffffff' }}>
              Ready to Practice What You Learned?
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#fed7aa', maxWidth: '640px' }}>
              Topic 01 includes <strong>25 hands-on coding challenges</strong> (13 Lugaish Original problems evaluated with real OpenJDK test cases + 12 curated external problems from CodeChef, HackerRank, beecrowd, and Codeforces).
            </p>
          </div>

          <button
            type="button"
            onClick={onSwitchToPractice}
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              border: 'none',
              color: '#0f172a',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)'
            }}
          >
            Go to Practice Problems (25 Challenges) <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Generic topic notes fallback for other topics
  return (
    <div className="space-y-6" style={{ padding: '4px 0' }}>
      <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '14px', padding: '22px' }}>
        <h3 style={{ color: '#fbbf24', fontSize: '20px', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} /> {video.title}
        </h3>
        <p style={{ fontSize: '14px', lineHeight: 1.8, color: '#fef3c7', margin: '8px 0 0' }}>
          {video.summary}
        </p>
      </div>

      <div style={{ background: 'var(--lx-panel)', border: '1px solid var(--lx-border)', borderRadius: '14px', padding: '22px' }}>
        <strong style={{ display: 'block', color: '#fbbf24', fontSize: '15px', marginBottom: '10px' }}>
          🎯 Syllabus Overview &amp; Learning Objectives
        </strong>
        <p style={{ fontSize: '13.5px', color: 'var(--lx-muted)', lineHeight: 1.7, margin: '0 0 16px' }}>
          {video.keyConcept || video.summary}
        </p>
        <p style={{ fontSize: '13px', color: 'var(--lx-muted)', lineHeight: 1.7, margin: 0 }}>
          Watch the lecture class video when available, review the key algorithmic patterns, and practice in the <strong>Practice Problems</strong> tab.
        </p>
      </div>
    </div>
  );
}

