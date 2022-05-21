import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../../constants";
import { save } from "../storage/local.storage";

export default function LoginForm() {
  const [username, setUsername] = useState("quan5masteradmin");
  const [password, setPassword] = useState("giaoviecquan5_2022@@");
  const onSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post(BASE_URL + "auth/login", {
      username,
      password,
    });
    console.log(response.data);

    const accessToken = response.data.accessToken;
    save(accessToken);
  };
  return (
    <div>
      LoginForm
      <form onSubmit={onSubmit}>
        <input
          defaultValue={username}
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          defaultValue={password}
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input type="submit" />
      </form>
    </div>
  );
}
