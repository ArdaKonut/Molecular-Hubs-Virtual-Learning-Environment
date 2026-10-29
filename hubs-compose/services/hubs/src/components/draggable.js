AFRAME.registerComponent('draggable', {
    schema: {
        enabled: {type: 'boolean', default: true}
    },
    init: function () {
        const el = this.el; // Reference to the A-Frame entity
        const data = this.data; // Access component data

        const onMouseDown = (event) => {
            if (data.enabled) {
                // Calculate the offset for dragging
                const offset = { 
                    x: event.detail.intersection.point.x - el.object3D.position.x, 
                    y: event.detail.intersection.point.y - el.object3D.position.y 
                };

                const onMouseMove = (event) => {
                    // Update the entity's position based on mouse movement
                    const newPosition = {
                        x: event.detail.intersection.point.x - offset.x,
                        y: event.detail.intersection.point.y - offset.y
                    };
                    el.object3D.position.set(newPosition.x, newPosition.y, el.object3D.position.z);
                };

                const onMouseUp = () => {
                    // Remove the event listeners when the mouse is released
                    el.sceneEl.removeEventListener('mousemove', onMouseMove);
                    el.sceneEl.removeEventListener('mouseup', onMouseUp);
                };

                // Add event listeners for mouse movement and release
                el.sceneEl.addEventListener('mousemove', onMouseMove);
                el.sceneEl.addEventListener('mouseup', onMouseUp);
            }
        };

        const onTouchStart = (event) => {
            if (data.enabled) {
                // Calculate the offset for dragging
                const touch = event.touches[0];
                const offset = { 
                    x: touch.clientX - el.object3D.position.x, 
                    y: touch.clientY - el.object3D.position.y 
                };

                const onTouchMove = (event) => {
                    // Update the entity's position based on touch movement
                    const touch = event.touches[0];
                    const newPosition = {
                        x: touch.clientX - offset.x,
                        y: touch.clientY - offset.y
                    };
                    el.object3D.position.set(newPosition.x, newPosition.y, el.object3D.position.z);
                };

                const onTouchEnd = () => {
                    // Remove the event listeners when the touch ends
                    el.sceneEl.removeEventListener('touchmove', onTouchMove);
                    el.sceneEl.removeEventListener('touchend', onTouchEnd);
                };

                // Add event listeners for touch movement and end
                el.sceneEl.addEventListener('touchmove', onTouchMove);
                el.sceneEl.addEventListener('touchend', onTouchEnd);
            }
        };

        el.addEventListener('mousedown', onMouseDown);
        el.addEventListener('touchstart', onTouchStart);
    }
});
