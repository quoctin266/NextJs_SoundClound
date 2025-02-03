"use client";

import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import { signIn } from "next-auth/react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

const initError = {
  username: "",
  password: "",
};

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(initError);

  const [loginError, setLoginError] = useState("");

  const router = useRouter();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    setLoginError("");

    const errors = {
      username: "",
      password: "",
    };
    if (!username) {
      errors.username = "Username must not be empty";
    }

    if (!password) {
      errors.password = "Password must not be empty";
    }

    if (!username || !password) {
      setErrors(errors);
      return;
    }

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    if (res?.error) {
      setLoginError(res.error);
    } else {
      router.push("/");
    }
  };

  return (
    <Grid
      container
      justifyContent={"center"}
      alignItems={"center"}
      height={"100vh"}
      sx={{
        background:
          "linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)",
      }}
    >
      <Grid item xs={11} sm={7} md={4} xl={3}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <Card
            sx={{
              p: 3,
            }}
          >
            <IconButton onClick={() => router.push("/")}>
              <ArrowBackIcon />
            </IconButton>

            <Grid container alignItems={"center"} flexDirection={"column"}>
              <Avatar>
                <LockIcon />
              </Avatar>
              <div>Sign in</div>
            </Grid>

            <TextField
              error={!!errors.username}
              value={username}
              onChange={(e) => {
                if (!e.target.value) {
                  setErrors({
                    ...errors,
                    username: "Username must not be empty",
                  });
                } else setErrors({ ...errors, username: "" });
                setUsername(e.target.value);
                setLoginError("");
              }}
              sx={{ mt: 3 }}
              fullWidth
              label="Username *"
              type="text"
              autoComplete="current-password"
            />
            {errors.username && (
              <FormHelperText error>{errors.username}</FormHelperText>
            )}

            <FormControl
              sx={{ mt: 3 }}
              error={!!errors.password}
              fullWidth
              variant="outlined"
            >
              <InputLabel>Password *</InputLabel>
              <OutlinedInput
                value={password}
                onChange={(e) => {
                  if (!e.target.value) {
                    setErrors({
                      ...errors,
                      password: "Password must not be empty",
                    });
                  } else setErrors({ ...errors, password: "" });
                  setPassword(e.target.value);
                  setLoginError("");
                }}
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password *"
              />
            </FormControl>
            {errors.password && (
              <FormHelperText error>{errors.password}</FormHelperText>
            )}

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 4 }}>
              Sign In
            </Button>
            {loginError && (
              <FormHelperText error sx={{ textAlign: "center", mt: 2 }}>
                {loginError}
              </FormHelperText>
            )}

            <Divider sx={{ mt: 4 }}>Or using</Divider>

            <Grid container justifyContent={"center"} gap={3} mt={3}>
              <IconButton
                sx={{
                  backgroundColor: "orange",
                  ":hover": { backgroundColor: "#ffca68" },
                }}
                onClick={() => signIn("github")}
              >
                <GitHubIcon sx={{ color: "white" }} />
              </IconButton>

              <IconButton
                sx={{
                  backgroundColor: "orange",
                  ":hover": { backgroundColor: "#ffca68" },
                }}
              >
                <GoogleIcon sx={{ color: "white" }} />
              </IconButton>
            </Grid>
          </Card>
        </form>
      </Grid>
    </Grid>
  );
}

export default LoginForm;
