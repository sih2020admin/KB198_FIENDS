import React, { useEffect, useState } from "react";

function Trail(props) {
  const [data, setData] = useState(props.data);

  useEffect(() => {
    console.log(props.data, props.lat);
  });

  return <div />;
}

export default Trail;
