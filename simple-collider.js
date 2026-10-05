AFRAME.registerComponent('simple-collider', {
    schema: {
        objects: { type: 'string', default: '.collidable' },
        radius: { type: 'number', default: 0.5 }
    },
    init: function () {
        this.prevPosition = new THREE.Vector3();
        this.playerBox = new THREE.Box3();
        this.targetBox = new THREE.Box3();
    },
    tick: function () {
        const el = this.el;
        const currentPos = el.object3D.position;

        // Bounding Box für den Spieler berechnen
        this.playerBox.min.set(
            currentPos.x - this.data.radius,
            currentPos.y,
            currentPos.z - this.data.radius
        );
        this.playerBox.max.set(
            currentPos.x + this.data.radius,
            currentPos.y + 1.8,
            currentPos.z + this.data.radius
        );

        const targets = document.querySelectorAll(this.data.objects);
        let collided = false;

        for (let i = 0; i < targets.length; i++) {
            const targetEl = targets[i];
            if (!targetEl.object3D) continue;

            // Bounding Box des Hindernisses berechnen
            this.targetBox.setFromObject(targetEl.object3D);

            if (this.playerBox.intersectsBox(this.targetBox)) {
                collided = true;
                break;
            }
        }

        if (collided) {
            // Bei Kollision auf vorherige Position zurücksetzen
            el.object3D.position.copy(this.prevPosition);
        } else {
            // Wenn frei, aktuelle Position speichern
            this.prevPosition.copy(currentPos);
        }
    }
});