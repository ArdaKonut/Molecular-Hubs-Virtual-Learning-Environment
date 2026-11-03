import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { hasComponent } from "bitecs";
import { Euler, MathUtils, Matrix4, Quaternion, Vector3 } from "three";
import { MediaLoader, Networked, Owned } from "../../bit-components";
import { findAncestorWithComponent } from "../../utils/bit-utils";
import { takeOwnership } from "../../utils/take-ownership";
import { setMatrixWorld } from "../../utils/three-utils";

function resolveTarget(activeObject) {
  // Older A-Frame media objects.
  const el = activeObject.el?.closest("[networked]");
  if (el) return { object: el.object3D, el };

  // Newer ECS media objects.
  const world = APP.world;
  const mediaEid = findAncestorWithComponent(world, MediaLoader, activeObject.eid);
  if (!mediaEid) throw new Error("Select an uploaded media object.");

  const eid = findAncestorWithComponent(world, Networked, mediaEid);
  const object = eid && world.eid2obj.get(eid);
  if (!object) throw new Error("No networked media root was found.");

  return { object, eid };
}

function readTransform(object) {
  object.updateMatrixWorld(true);

  const position = new Vector3();
  const quaternion = new Quaternion();
  const scale = new Vector3();
  object.matrixWorld.decompose(position, quaternion, scale);

  const rotation = new Euler().setFromQuaternion(quaternion, "YXZ");
  const rounded = value => Number(value.toFixed(4)).toString();

  return {
    x: rounded(position.x),
    y: rounded(position.y),
    z: rounded(position.z),
    rx: rounded(MathUtils.radToDeg(rotation.x)),
    ry: rounded(MathUtils.radToDeg(rotation.y)),
    rz: rounded(MathUtils.radToDeg(rotation.z)),
    size: rounded(scale.x)
  };
}

const fields = [
  ["x", "Position X"],
  ["y", "Position Y"],
  ["z", "Position Z"],
  ["rx", "Rotation X °"],
  ["ry", "Rotation Y °"],
  ["rz", "Rotation Z °"],
  ["size", "Size (X scale)"]
];

export function ObjectTransformControls({ activeObject, disabled, isPinned }) {
  const [values, setValues] = useState(null);
  const [message, setMessage] = useState("");

  function readCurrent() {
    try {
      setValues(readTransform(resolveTarget(activeObject).object));
      setMessage("");
    } catch (error) {
      setValues(null);
      setMessage(error.message);
    }
  }

  useEffect(() => {
    readCurrent();
    // Read again when the selection changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeObject]);

  function apply() {
    try {
      if (disabled || isPinned) {
        throw new Error("Unpin the object and check your editing permissions.");
      }

      const numbers = {};
      for (const [key] of fields) {
        if (!values[key].trim()) throw new Error("Complete every field.");
        numbers[key] = Number(values[key]);
        if (!Number.isFinite(numbers[key])) {
          throw new Error("Every field must contain a finite number.");
        }
      }

      if (numbers.size <= 0) throw new Error("Size must be greater than zero.");

      const target = resolveTarget(activeObject);

      if (target.el) {
        if (!NAF.utils.isMine(target.el) && !NAF.utils.takeOwnership(target.el)) {
          throw new Error("Unable to acquire object ownership.");
        }
      } else {
        takeOwnership(APP.world, target.eid);
        if (!hasComponent(APP.world, Owned, target.eid)) {
          throw new Error("Unable to acquire object ownership.");
        }
      }

      target.object.updateMatrixWorld(true);

      const oldPosition = new Vector3();
      const oldQuaternion = new Quaternion();
      const scale = new Vector3();
      target.object.matrixWorld.decompose(oldPosition, oldQuaternion, scale);

      if (scale.x <= 0) {
        throw new Error("This object's scale needs inspection before editing.");
      }

      // Change size while preserving the existing proportions.
      scale.multiplyScalar(numbers.size / scale.x);

      const position = new Vector3(numbers.x, numbers.y, numbers.z);
      const rotation = new Euler(
        MathUtils.degToRad(numbers.rx),
        MathUtils.degToRad(numbers.ry),
        MathUtils.degToRad(numbers.rz),
        "YXZ"
      );
      const quaternion = new Quaternion().setFromEuler(rotation);
      const matrix = new Matrix4().compose(position, quaternion, scale);

      setMatrixWorld(target.object, matrix);
      target.object.updateMatrixWorld(true);

      setValues(readTransform(target.object));
      setMessage("Applied. Verify placement, then use Pin to save it.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <details
      style={{ padding: "10px", minWidth: "220px" }}
      onKeyDown={event => event.stopPropagation()}
    >
      <summary>Precise placement</summary>
      <p style={{ fontSize: "12px" }}>
        World coordinates. Size preserves proportions.
        {isPinned ? " Unpin this object before editing." : ""}
      </p>

      {values &&
        fields.map(([key, label]) => (
          <label
            key={key}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "8px",
              marginBottom: "6px"
            }}
          >
            {label}
            <input
              type="number"
              step="any"
              value={values[key]}
              disabled={disabled || isPinned}
              style={{ width: "95px", color: "#111", background: "#fff" }}
              onChange={event =>
                setValues(previous => ({
                  ...previous,
                  [key]: event.target.value
                }))
              }
            />
          </label>
        ))}

      <button type="button" onClick={readCurrent}>
        Read current
      </button>{" "}
      <button
        type="button"
        disabled={!values || disabled || isPinned}
        onClick={apply}
      >
        Apply
      </button>

      <p role="status" style={{ fontSize: "12px" }}>
        {message}
      </p>
    </details>
  );
}

ObjectTransformControls.propTypes = {
  activeObject: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  isPinned: PropTypes.bool.isRequired
};