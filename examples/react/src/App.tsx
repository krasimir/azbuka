import { useState } from 'react'
import './forgecss.css';
import fx from '../../../packages/forgecss/fx'

function App() {
  const [ progress, setProgress ] = useState(false);
  const [ success, setSuccess ] = useState(false);
  const [theme, setTheme ] = useState<'light' | 'dark'>('dark');
  const [errors, setErrors ] = useState<{ username: boolean | string, password: boolean | string }>({ username: false, password: false });

  async function submit(e) {
    e.preventDefault();
    setProgress(true);
    if (e.target.username.value === '') {
      setErrors(errors => ({ ...errors, username: 'Username is required' }));
      setProgress(false);
      return;
    }
    if (e.target.password.value === "") {
      setErrors((errors) => ({ ...errors, password: "Password is required" }));
      setProgress(false);
      return;
    }
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    // setSuccess(true);
    // setProgress(false);
  }
  function clearErrors(field: string) {
    setErrors((errors) => ({ ...errors, [field]: false }));
  }

  const isErrored = Boolean(errors.username || errors.password);

  return (
    <main className={fx(`p1 flex-col ${theme}`)}>
      <form onSubmit={submit} className={fx("fullw desktop:w400")}>
        <fieldset
          className={fx(
            `[.dark &]:background-light desktop:p2 no-border [${isErrored}?]:error-border [${success}?]:success-border`
          )}
        >
          {success ? (
            <p className="primary">You are ready to go!</p>
          ) : (
            <>
              <label className={fx("flex-col align-start desktop:flex-row,align-center gap1 space-between")}>
                <span>Username:</span>
                <div>
                  <input
                    type="text"
                    name="username"
                    placeholder="<username here>"
                    disabled={progress}
                    className={fx("disabled:op05 fullw desktop:autow")}
                    autoFocus
                    onChange={() => clearErrors("username")}
                  />
                  {errors.username && <small className={fx("block error mt05")}>{errors.username}</small>}
                </div>
              </label>
              <label className={fx("flex-col align-start desktop:flex-row,align-center gap1 space-between")}>
                <span>Password:</span>
                <div>
                  <input
                    type="text"
                    name="password"
                    placeholder="*****"
                    disabled={progress}
                    className={fx("disabled:op05 fullw desktop:autow")}
                    onChange={() => clearErrors("password")}
                  />
                  {errors.password && <small className={fx("block error mt05")}>{errors.password}</small>}
                </div>
              </label>
              <button
                type="submit"
                className={fx("hover:primary2-bg [&:disabled]:op05 [&:disabled:hover]:primary-bg")}
                disabled={progress}
              >
                {progress ? "Logging in ... " : "Login"}
              </button>
            </>
          )}
        </fieldset>
      </form>
      <div className={fx("flex gap1 mt1")}>
        <label>
          <input type="radio" name="theme" checked={theme === "dark"} onChange={() => setTheme("dark")} />
          Dark theme
        </label>
        <label>
          <input type="radio" name="theme" checked={theme === "light"} onChange={() => setTheme("light")} />
          Light theme
        </label>
      </div>
    </main>
  );
}

export default App
