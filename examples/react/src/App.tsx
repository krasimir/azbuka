import { useState } from 'react'
import './azbuka.css';
import az from '../../../packages/azbuka/az'

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
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSuccess(true);
    setProgress(false);
  }
  function clearErrors(field: string) {
    setErrors((errors) => ({ ...errors, [field]: false }));
  }

  const isErrored = Boolean(errors.username || errors.password);

  return (
    <main className={az(`p1 flex-col ${theme}`)}>
      <form onSubmit={submit} className={az("fullw desktop:w400")}>
        <fieldset
          className={az(
            `surface
            [.light &]:surface-light,text-light
            desktop:p2
            no-border
            [${isErrored}]:error-border
            [${success}]:success-border`
          )}
        >
          {success ? (
            <p className="primary">You are ready to go!</p>
          ) : (
            <>
              <label className={az("flex-col align-start desktop:flex-row,align-center gap1 space-between")}>
                <span>Username:</span>
                <div className={az("fullw desktop:autow")}>
                  <input
                    type="text"
                    name="username"
                    placeholder="<username here>"
                    disabled={progress}
                    className={az("disabled:op05 fullw desktop:autow")}
                    autoFocus
                    onChange={() => clearErrors("username")}
                  />
                  {errors.username && <small className={az("block error mt05")}>{errors.username}</small>}
                </div>
              </label>
              <label className={az("flex-col align-start desktop:flex-row,align-center gap1 space-between")}>
                <span>Password:</span>
                <div className={az("fullw desktop:autow")}>
                  <input
                    type="password"
                    name="password"
                    placeholder="*****"
                    disabled={progress}
                    className={az("disabled:op05 fullw desktop:autow")}
                    onChange={() => clearErrors("password")}
                  />
                  {errors.password && <small className={az("block error mt05")}>{errors.password}</small>}
                </div>
              </label>
              <button
                type="submit"
                className={az("hover:primary2-bg [&:disabled]:op05 [&:disabled:hover]:primary-bg")}
                disabled={progress}
              >
                {progress ? "Logging in ... " : "Login"}
              </button>
            </>
          )}
        </fieldset>
      </form>
      <div className={az("flex gap1 mt1")}>
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
